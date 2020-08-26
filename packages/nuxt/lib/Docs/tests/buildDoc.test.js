/**
 *  @class Node this class holds methods to define nodes
 *  @class Tree creates a tree of Node instances based on the text input 
 *  These two classes are used to process text files and based on certain rules
 *  create a tree similar to the DOM to better manipulate text and markdown documents
 *  USE CASE: many documents are written in flat text or markdown, and we want to extract,
 *  metadata in a certain way based on certain settings, we turn such flat data into a tree 
 *  structure so that we can easily search and extract elements
 */

export class Node {
    constructor(line) {
        this.id = Math.floor(Math.random() * 1000);
        this.type = line.match(/(?:^|(?:[.!?]\s))(\w+)/) ? 'p' : line.replace(/ .*/, '');
        this.line = this.type === 'p' ? line : line.replace(this.type, '').trim();
        this.parentId = null; // get if the ref node has children

        // SOLUTION: ASSIGN THE MAX PARENTS LENGTH FOR NOW
        this.depth = 5; // todo: set ref as max depth in the tree....
        this.isParent = false;
        this.children = [];
    }

    // todo: Separate frontmatter or assume a frontmatter

    // In corporate this two methods also inside the constructor function
    setIsParent(parents) {
        parents.forEach((element) => {
            if (this.type === element) {
                return this.isParent = true;
            }
        })
    }
    setDepth(depthLevels) {
        depthLevels.forEach((element, index) => {
            if (this.type === element) {
                return this.depth = index + 1;
            }
            else {
                return depthLevels.length + 1
            }

            // todo: assign a lower level to anything that is not a parent
        })
    }
    /**
     * this helps us defined module children,
     * we need this children to generate for instance bill of materials
     */
    get isKey() {
        return this.line.indexOf(':') === -1 ? false : true;
    }
    get isKeyValue() {
        return this.isKey && this.line.length - 1 > this.line.indexOf(':')
    }

    // todo: Get is it a toml node????
}

/**
 * @param {array} options provide some configuration to build the tree
 */

export default class Tree {
    constructor(options) {
        if (!options) { options = {} }
        this.id = options.id ? options.id : Math.floor(Math.random() * 1000);
        this.parents = options.parents ? options.parents : ['#', '##', '###', '####'];
        this.data = options.text ? options.text.split('\r\n') : ['# This document is empty', '## This is a property', 'This is a paragraph']// create an array that holds text lines
        this.root = null;
        this.ref = null;

        this.data.forEach((element) => {
            if (element.length > 0) {
                this.insertNode(element);
            }
        });

        // not relevant after tree is build
        delete this.data;
        delete this.ref;
    }

    // todo: we need a rebuild method in case some new options are passed

    splitMetadataAndText() {
        // todo: chop first the frontmatter from the document
        // Use reduce to do so
        // find the first ---
        // Find the next --- and split
        return "here goes the yaml"
    }

    /**
     * @method findNode is used to find a node referenced where a new children,
     * needs to be inserted
     * The tree needs to be wrapped around an array []
     * @param {number} id of object that needs to be found 
     */
    findNode(tree, value, key = 'id', reverse = false) {
        const stack = [tree[0]]
        while (stack.length) {
            const node = stack[reverse ? 'pop' : 'shift']()
            if (node[key] === value) return node
            node.children && stack.push(...node.children)
        }
        return null
    }

    /**
     * We need to find the parent to determine where to insert a 
     * new Node instance in the tree, the newNode at this point doesnt
     * have a parent yet
     * @param node an object
     * @param ref an object
     */
    findParent(node, ref) {

        if (node.depth > ref.depth) {
            // This would also have to be recursive
            return ref;
        }

        else if (node.depth == ref.depth) {
            // returns the node which id correspond to the reference parent
            return this.findNode([this.root], ref.parentId, 'id')
        }

        else if (node.depth < ref.depth) {
            let self = this;
            let getParent = function (ref, nodeDepth) {
                if (ref.depth == nodeDepth - 1) {
                    return ref;
                }
                ref = self.findNode([self.root], ref.parentId, 'id');
                return getParent(ref, nodeDepth);
            }
            return getParent(ref, node.depth);
        }

        return null;

    }

    insertNode(line) {
        let ref;
        let newNode = new Node(line);
        newNode.setIsParent(this.parents);
        newNode.setDepth(this.parents);
        ref = this.ref;

        // todo: cut off the front matter...
        // todo: handle key value pair and remove line from paragraphs
        // todo: If not parent... do something 

        if (this.root === null) {
            this.root = newNode;
            this.ref = this.root;
            newNode.parentId = 0; // zero represents root
            return this;
        }

        else {
            ref = this.findParent(newNode, ref);
            newNode.parentId = ref.id;
            ref.children.push(newNode);

            if (newNode.isParent) {
                this.ref = newNode;
            }

            else { this.ref = ref; }
        }
    }
}







