/**
 * Shuffles an array in-place (does not copy) using Fisher-Yates.
 * @param {array} array
 */
const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * Helper function to convert polar coordinates to cartesian coordinates
 * @param {number} r Radius
 * @param {number} t Angle (theta) in radians
 * @returns {array} Cartesian coordinates in the format [x, y]
 */
const polarToCart = (r, t) => [r * Math.cos(t), r * Math.sin(t)];

class Graph {
  /**
   * Creates a graph
   */
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.inDegree = new Map();
  }

  /**
   * Adds a new node to the graph, giving it an ID
   * If passed an id and value, adds that specific node. Otherwise,
   * generates a new node with value 0 and random unique-ish id.
   * @param {string} id
   * @param {number} value
   */
  addNode(
    id = Math.random()
      .toString(36)
      .substr(2, 4),
    value = 0
  ) {
    this.nodes.set(id, value);
    this.edges.set(id, new Map());
    this.inDegree.set(id, 0);
  }

  /**
   * Creates an edge between two nodes in the graph
   * @param {object} nodeFrom
   * @param {object} nodeTo
   */
  addEdge(nodeFrom, nodeTo, weight = 1) {
    this.edges.get(nodeFrom).set(nodeTo, weight);
    this.inDegree.set(nodeTo, this.inDegree.get(nodeTo) + 1);
  }

  /**
   * Removes an edge between two nodes in the graph
   * @param {object} nodeFrom
   * @param {object} nodeTo
   */
  removeEdge(nodeFrom, nodeTo) {
    this.edges.get(nodeFrom).delete(nodeTo);
    this.inDegree.set(nodeTo, this.inDegree.get(nodeTo) - 1);
  }

  /**
   * Draws a graph in the canvas element on the page
   */
  draw() {
    // set up canvas
    const canvas = document.querySelector("canvas");
    let dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    // set 0, 0 to center and save as default
    ctx.translate(canvas.width / 4, canvas.height / 4);
    ctx.save();

    const keys = Array.from(this.nodes.keys());

    // build a map of each node and its coordinates
    const coords = new Map(this.nodes);
    coords.forEach((val, key) => {
      coords.set(
        key,
        polarToCart(100, 2 * Math.PI * (keys.indexOf(key) / this.nodes.size))
      );
    });

    this.nodes.forEach((val, nodeFrom) => {
      // draw a circle where this node is
      ctx.beginPath();
      ctx.arc(...coords.get(nodeFrom), 5, 0, 2 * Math.PI);
      ctx.fillText(
        nodeFrom,
        coords.get(nodeFrom)[0] + 5,
        coords.get(nodeFrom)[1] - 5
      );
      ctx.fill();
      this.edges.get(nodeFrom).forEach((weight, nodeTo) => {
        // draw a line for each connection
        ctx.beginPath();
        ctx.moveTo(...coords.get(nodeFrom));
        ctx.lineTo(...coords.get(nodeTo));
        ctx.stroke();
        // draw an arrowhead!
        // save the context, then move it to the end point of the line
        ctx.save();
        ctx.translate(...coords.get(nodeTo));
        // rotate the context so it is perpendicular to the line
        ctx.rotate(
          Math.atan2(
            coords.get(nodeTo)[1] - coords.get(nodeFrom)[1],
            coords.get(nodeTo)[0] - coords.get(nodeFrom)[0]
          ) + Math.PI
        );
        // move over so that arrow doesn't overlap circle
        ctx.translate(5, 0);
        // draw a triangle
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(...polarToCart(10, 2 * Math.PI * 0.1));
        ctx.lineTo(...polarToCart(10, 2 * Math.PI * -0.1));
        ctx.lineTo(0, 0);
        ctx.fill();
        // reset canvas to 0, 0
        ctx.restore();
      });
    });
  }

  /**
   * Connects the graph with density p. Based on the Erdos-Renyi random graph model.
   * @param {number} p
   */
  connect(p = 0.5) {
    const queue = Array.from(this.nodes.keys());
    const visited = [];
    shuffle(queue);
    // pick a random number of ranks from between 2 and queue.length
    const ranks = Math.floor(2 + Math.random() * (queue.length - 1));
    const nodesPerRank = Math.ceil(queue.length / ranks);
    while (queue.length) {
      // We want the average nodes in a rank to approach nodesPerRank, so pick between 0 and 2n.
      const nRank = Math.ceil(Math.random() * 2 * nodesPerRank);
      const thisRank = queue.splice(0, nRank);
      thisRank.map(nodeFrom => {
        visited.map(nodeTo => {
          if (Math.random() < p) {
            this.addEdge(nodeFrom, nodeTo);
          }
        });
        visited.push(nodeFrom);
      });
    }
  }

  /**
   * Finds the topological sorting of the graph using Kahn's algorithm.
   * @returns {array} a list of nodes
   */
  sort() {
    const degrees = new Map(this.inDegree);
    const queue = [];
    const order = [];
    degrees.forEach((val, key) => {
      // start off the queue with all 0-order nodes
      if (val === 0) {
        queue.push(key);
      }
    });
    while (queue.length) {
      // dequeue a node n
      const currentKey = queue.shift();
      this.edges.get(currentKey).forEach((val, key) => {
        // for each node m that has an edge coming from n, subtract one from m's in-degree
        degrees.set(key, degrees.get(key) - 1);
        // if m has a 0 in-degree, enqueue it
        if (degrees.get(key) === 0) {
          queue.push(key);
        }
      });
      // record the node we dequeued
      order.push(currentKey);
      // do this until the queue is empty
    }
    return order;
  }

  /**
   * Initializes values of parent nodes at random
   */
  initRandomValues() {
    this.inDegree.forEach((value, node) => {
      if (!value) {
        this.nodes.set(node, Math.random());
      }
    });
    this.updateValues();
  }

  updateValues() {
    const queue = this.sort();
    const visited = [];
    // distribute values to children nodes
    while (queue.length) {
      const nodeFrom = queue.shift();
      this.edges.get(nodeFrom).forEach((weight, nodeTo) => {
        visited.push(nodeTo);
        const newValue =
          this.nodes.get(nodeTo) + this.nodes.get(nodeFrom) * weight;
        this.nodes.set(nodeTo, newValue);
      });
    }
  }
}

const demo = new Graph();
demo.addNode();
demo.addNode();
demo.addNode();
demo.addNode();
demo.addNode();
demo.addNode();
demo.addNode();

demo.connect(0.25);
demo.draw();
demo.initRandomValues();
console.log(demo.nodes);
