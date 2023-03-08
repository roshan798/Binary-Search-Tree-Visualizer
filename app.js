import { plot } from "./d3.js";
import { BST } from "./BST.js";

var bst = new BST();
var tree;

let refreshTreeStructure = (currValue) => {
    let svg = document.querySelectorAll("svg");
    if (svg.length) {
        svg[0].remove();
    }
    tree = bst.getTree(bst.getRoot());

    if (tree != undefined)
        plot(tree, currValue);
}
let willDelete = false;
let find = (key, root) => {
    // console.log(key, root);
    if (root == undefined) return;
    refreshTreeStructure(root.name);
    if (root.name == key) {
        if(willDelete==true)
            bst.remove(key);
            setTimeout(()=>{
                refreshTreeStructure(root.name);
            },500); 
            return;
    }
    else if (root.children != undefined && root.children.length == 2) {
        // console.log("else if")
        if (root.name > key) {
            setTimeout(find, 700, key, root.children[0]);
        }
        else {
            setTimeout(find, 700, key, root.children[1]);
        }
    }
    else if (root.children != undefined && root.children.length == 1) {
        // console.log("else")

        if (root.name > key && root.name > root.children[0].name) {
            setTimeout(find, 600, key, root.children[0]);
        }
        else if (root.name < key && root.name < root.children[0].name) {
            setTimeout(find, 600, key, root.children[0]);
        }
        else {
            refreshTreeStructure(null);
            alert(`${key} is no present in the tree`);
        }
    }
    else {
        refreshTreeStructure(null);
        alert(`${key} is no present in the tree`);
    }
}

let insertForm = document.getElementById("form1");
insertForm.addEventListener("submit", e => {
    e.preventDefault();
    let insert = document.getElementById("insert");
    let value = insert.value;
    insert.inputMode = "none";
    setTimeout(insert => {
        insert.inputMode = "numeric";
    }, 50, insert);

    if (value == "" || Number.isInteger(parseInt(value)) == false) {
        alert("wrong input");
    }
    else {
        bst.insert(value);
        refreshTreeStructure(value);
    }
    insert.value = "";
});
let searchForm = document.getElementById("form3");
searchForm.addEventListener("submit", e => {
    e.preventDefault();
    let search = document.getElementById("find");
    let value = parseInt(search.value);
    search.inputMode = "none";
    setTimeout(search => {
        search.inputMode = "numeric";
    }, 50, search);
    if (value == "" || Number.isInteger(value) == false) {
        alert("wrong input");
    }
    else {
        willDelete = false;
        find(value, tree);
    }
    search.value = "";
});
let removeForm = document.getElementById("form2");
removeForm.addEventListener("submit", e => {
    e.preventDefault();
    let remove = document.getElementById("remove");
    let value = remove.value;
    remove.inputMode = "none";
    setTimeout(insert => {
        insert.inputMode = "numeric";
    }, 50, remove);

    if (value == "" || Number.isInteger(parseInt(value)) == false) {
        alert("wrong input");
    }
    else {
        willDelete = true;
        find(value,tree);
    }
    remove.value = "";

});

