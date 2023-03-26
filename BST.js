class Node {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
};
export class BST {
    constructor() {
        this.root = null;
    }
    getRoot() {
        return this.root;
    }
    insert(val) {
        var newNode = new Node(parseInt(val));
        if (this.root == null)
            this.root = newNode;
        else
            this.insertNode(this.root, newNode);
    }
    insertNode(currNode, newNode) {
        if (newNode.val < currNode.val) {
            if (currNode.left == null) {
                currNode.left = newNode;
            }
            else
                this.insertNode(currNode.left, newNode);
        }
        else if (newNode.val > currNode.val) {
            if (currNode.right == null)
                currNode.right = newNode;
            else
                this.insertNode(currNode.right, newNode);
        }
    }
    getTree(currNode) {
        if (currNode != null) {
            let node = {
                name: currNode.val,
                children: []
            };
            let l = this.getTree(currNode.left);
            let r = this.getTree(currNode.right);
            if (l != null)
                node.children.push(l);
            if (r != null)
                node.children.push(r);
            if (node.children.length == 0)
                delete node.children
            return node;
        }
    }
    
    //  deletion Code From gfg
    findMinNode(node) {
        if (node.left === null)
            return node;
        else
            return this.findMinNode(node.left);
    }

    remove(data) {
        this.root = this.removeNode(this.root, data);
    }
    removeNode(node, key) {
        if (node === null)
            return null;
        else if (key < node.val) {
            node.left = this.removeNode(node.left, key);
            return node;
        }
        else if (key > node.val) {
            node.right = this.removeNode(node.right, key);
            return node;
        }
        else {
            // deleting node with no children
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }
            // deleting node with one children
            if (node.left === null) {
                node = node.right;
                return node;
            } else if (node.right === null) {
                node = node.left;
                return node;
            }

            var aux = this.findMinNode(node.right);
            node.val = aux.val;
            node.right = this.removeNode(node.right, aux.val);
            return node;
        }
    }
}