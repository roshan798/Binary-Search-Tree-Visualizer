import { plot } from "./d3.js";
import { BST } from "./BST.js";
import { getPosition } from "./d3.js";

var bst = new BST();
var tree;
let delay = 800;
let isRunningSomething = false;
let willDelete = false;
let refreshTreeStructure = (currValue, isInserting) => {
    if (isInserting) {
        isInserting = !findInTree(currValue);
    }
    let svg = document.querySelectorAll("svg");
    if (svg.length) {
        svg[0].remove();
    }
    tree = bst.getTree(bst.getRoot());

    if (tree != undefined)
        plot(tree, currValue, isInserting);
}
bst.insert("12");
bst.insert("134");

bst.insert("24");
bst.insert("10");

refreshTreeStructure();
let find = (key, root) => {
    if (root == undefined) return;
    refreshTreeStructure(root.name);
    move(root.name);
    if (root.name == key) {
        changeHeading(`${key} Found`);
        clearMeassge();
        if (willDelete == true)
            bst.remove(key);
        setTimeout(() => {
            refreshTreeStructure(root.name);
        }, delay);
        return;
    }
    else if (root.children != undefined && root.children.length == 2) {
        if (root.name > key) {
            setTimeout(find, delay, key, root.children[0]);
        }
        else {
            setTimeout(find, delay, key, root.children[1]);
        }
    }
    else if (root.children != undefined && root.children.length == 1) {

        if (root.name > key && root.name > root.children[0].name) {
            setTimeout(find, delay, key, root.children[0]);
        }
        else if (root.name < key && root.name < root.children[0].name) {
            setTimeout(find, delay, key, root.children[0]);
        }
        else {
            refreshTreeStructure(null);
            changeHeading(`${key} Not found`);
            clearMeassge();
        }
    }
    else {
        refreshTreeStructure(null);
        changeHeading(`${key} Not found`);
        clearMeassge();
    }
}
let forms = Array.from(document.forms);

forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (isRunningSomething == false) {
            isRunningSomething = true;
            let inputBox = event.target[0];
            let value = inputBox.value;
            inputBox.inputMode = "none";
            setTimeout(() => {
                inputBox.inputMode = "numeric";
            }, 50);
            inputBox.value = "";
            if (value == "" || Number.isInteger(parseInt(value)) == false) {
                alert("wrong input");
            }
            else {
                switch (event.target.id) {
                    case 'form1':
                        bst.insert(value);
                        refreshTreeStructure(value, true);
                        break;
                    case 'form2':
                        willDelete = true;
                        find(value, tree);
                        break;
                    case 'form3':
                        willDelete = false;
                        find(value, tree);
                        break;
                }
            }
            isRunningSomething = false;
        }
    });
});

function traverseTreeInPreorderWithGap(node) {
    // If node is null or undefined, return a resolved promise
    if (!node) return Promise.resolve();

    // Return a new promise that resolves when the entire tree has been traversed in preorder
    return new Promise((resolve) => {
        // Perform the action for the current node
        appendMessage(node.name);
        move(node.name);
        refreshTreeStructure(node.name);

        // Wait for delay milliseconds before traversing the left subtree
        setTimeout(() => {
            // Traverse the left subtree in preorder, then traverse the right subtree in preorder
            traverseTreeInPreorderWithGap(node.children && node.children[0]).then(() => {
                traverseTreeInPreorderWithGap(node.children && node.children[1]).then(resolve);
            });
        }, delay);
    });
}

function traverseTreeInPostorderWithGap(node) {
    // Base case: return a resolved Promise if node is null or undefined
    if (!node) return Promise.resolve();

    // Return a Promise that resolves when traversal of the subtree rooted at node is complete
    return new Promise((resolve) => {
        // Move the node and update the display
        move(node.name);
        appendMessage(node.name);
        refreshTreeStructure(node.name);

        // Traverse the right subtree first, then the left, and finally resolve the Promise
        setTimeout(() => {
            traverseTreeInPostorderWithGap(node.children && node.children[1]).then(() => {
                traverseTreeInPostorderWithGap(node.children && node.children[0]).then(resolve);
            });
        }, delay);
    });
}


function traverseTreeInorderWithGap(node) {
    // Base case: if node is null, return a resolved promise
    if (!node) return Promise.resolve();

    // Create a promise that will be resolved after a delay
    return new Promise((resolve) => {
        setTimeout(() => {
            // Traverse the left subtree recursively
            traverseTreeInorderWithGap(node.children && node.children[0]).then(() => {
                // Append message and refresh tree structure for the current node
                appendMessage(node.name);
                move(node.name);
                refreshTreeStructure(node.name);

                // If the current node is a leaf node, resolve the promise after a delay
                if (!node.children) {
                    setTimeout(() => {
                        resolve();
                    }, delay - 100);
                }
                // If the current node has a right subtree, traverse it recursively
                else {
                    traverseTreeInorderWithGap(node.children[1]).then(resolve);
                }
            });
        }, delay);
    });
}

document.querySelectorAll(".traversal")
    .forEach(traversal => {
        traversal.addEventListener("click", e => {
            e.preventDefault();
            if (isRunningSomething == false) {

                clearMeassge();
                switch (e.target.id) {
                    case "pre":
                        changeHeading("Preorder");
                        isRunningSomething = true;
                        traverseTreeInPreorderWithGap(tree).then(() => {
                            refreshTreeStructure();
                            isRunningSomething = false
                        });
                        break;
                    case "post":
                        changeHeading("Postorder");
                        isRunningSomething = true;
                        traverseTreeInPostorderWithGap(tree).then(() => {
                            // console.log(isRunningSomething);
                            refreshTreeStructure();
                            isRunningSomething = false
                        });
                        break;
                    case "in":
                        changeHeading("Inorder");
                        isRunningSomething = true;
                        traverseTreeInorderWithGap(tree).then(() => {
                            refreshTreeStructure();
                            isRunningSomething = false
                        });
                        break;
                    case "level":
                        changeHeading("Level order");
                        console.log(e);
                }
            }

        });
    });

function changeHeading(meassge) {
    document.getElementById("message-heading")
        .innerText = meassge;
}
function clearMeassge() {
    document.getElementById("message").innerText = "";

}
function appendMessage(m) {
    let messageBox = document.getElementById("message");
    messageBox.style.padding = '5px';
    if (messageBox.innerText == '') {
        messageBox.innerText = m;
    }
    else {
        messageBox.innerText += `, ${m}`;
    }
}
function move(num) {
    console.log("i'll implement it sooner");
    // let pos = getPosition(parseInt(num));
    // let box = document.getElementById("circle");
    // box.style.left = (pos.x - 15) + "px";
    // box.style.top = (pos.y - 15) + "px";
}
function findInTree(val) {
    let flag = false;
    document.querySelectorAll("text").forEach(text => {
        if (text.innerHTML == val)
            flag = true;
    });
    return flag;
}