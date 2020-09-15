/* 
* author: Nikesh Subedi
* SID: @02940867
*/

//Creating a node for the Prefix Tree to store the dictionary.
function PrefixTreeNode(key){
	// key represents the character in the node
  this.key = key;
  // children is the hashmap of the child nodes connected to a node
	this.children ={};
  // isWord is a flag that when true represents that the current node is a word in the dictionary
	this.isWord = false
}

// Tree class with root node for the prefix tree
function PrefixTree() {
	this.root = new PrefixTreeNode(null);
}

// Method to insert a word into the prefix tree
PrefixTree.prototype.insert = function(word){
	if (word.length == 0){
		return;
	}
	var node = this.root;
	
	for(var i = 0; i < word.length; i++) {
    // Create new node if node is not found
		if (!node.children[word[i]]) {
		  node.children[word[i]] = new PrefixTreeNode(word[i]);
		}
    // Traverse the tree if node is found
		node = node.children[word[i]];
    // Set the isWord Flag to true if it is the end of the word
		if (i == word.length-1) {
		  node.isWord = true;
		}
	}
};

/**
 * Given a Boggle board and a dictionary, returns a list of available words in
 * the dictionary present inside of the Boggle board.
 * @param {string[][]} grid - The Boggle game board.
 * @param {string[]} dictionary - The list of available words.
 * @returns {string[]} solutions - Possible solutions to the Boggle board.
 */
exports.findAllSolutions = function(grid, dictionary) {
	this.solutions = [];
	
  // Checking for valid grid
	this.gridDimension = grid.length;
	for (var i=0;i<this.gridDimension;i++){
		if (grid[i].length != this.gridDimension){
			console.log("Invalid grid");
			return this.solutions;
		}
	}
	this.grid = grid;
	
	// Creating Prefix Tree from Dictionary
	this.createPrefixTreeFromDictionary(dictionary);
  
  // Finding the possible set of words
	this.findWords();
	return [...new Set(this.solutions)].sort();
};

// Creates a PrefixTree from a list of strings
exports.createPrefixTreeFromDictionary = function(dictionary){
	this.tree = new PrefixTree();
	for (const word of dictionary) {
		if (word.length >=3) this.tree.insert(word.toLowerCase());
	}
};

// A method to check whether a index in the grid is safe to visit or not
exports.isSafeToVisit = function(i,j,visited){
	return (i >= 0 && i < this.gridDimension && j >= 0
                && j < this.gridDimension && !visited[i][j]); 
};

// Starts the recursive call to find words in the grid
exports.findWords = function(){
	var currentNode = this.tree.root;
	var currentWord = ""; 
	for (var i = 0; i < this.gridDimension; i++) { 
		for (var j = 0; j < this.gridDimension; j++) {
			var character = this.grid[i][j].toLowerCase();
			var visited = new Array(this.gridDimension).fill(false).map(() => new Array(this.gridDimension).fill(false));
			if (character.length == 1 && character in currentNode.children){
				this.searchForWords(currentNode.children[character], i, j, visited, currentWord + character); 
			}
			else if (character.length>1){
				var characterInPrefixTree = true;
				var tempNode = currentNode;
				var k = 0;
				while (k < character.length && characterInPrefixTree){
					(character[k] in tempNode.children) ? tempNode = tempNode.children[character[k]] : characterInPrefixTree = false;
					k++;
				}
				if (characterInPrefixTree){
					this.searchForWords(tempNode, i, j, visited, currentWord + character);
				}
			}
		} 
	}
};

// Recursive method to look for words
exports.searchForWords = function(currentNode, i, j, visited, currentWord){
	
  // Check if current word is a word in the dictionary and check for word length
  if (currentNode.isWord == true && currentWord.length >=3) {
		this.solutions.push(currentWord);
	}
  
  // Mark current index in grid as visited
	if (this.isSafeToVisit(i , j, visited)) visited[i][j] = true;
	
  // Check for all 8 possible adjacent index around the current index whether it is in the Prefix Tree and traverse as necessary
  
  // Check 1
	this.checkAdjacentGrid(currentNode,i + 1,j + 1,visited,currentWord);
  
	// Check 2
	this.checkAdjacentGrid(currentNode,i ,j + 1,visited,currentWord);
  
	// Check 3
	this.checkAdjacentGrid(currentNode,i - 1 ,j + 1,visited,currentWord);
  
	// Check 4
	this.checkAdjacentGrid(currentNode,i + 1 ,j,visited,currentWord);
  
	// Check 5
	this.checkAdjacentGrid(currentNode,i + 1,j - 1,visited,currentWord);
  
	// Check 6
	this.checkAdjacentGrid(currentNode,i ,j - 1,visited,currentWord);
  
	// Check 7
	this.checkAdjacentGrid(currentNode,i - 1 ,j - 1,visited,currentWord);
  
	// Check 8
  this.checkAdjacentGrid(currentNode,i - 1,j,visited,currentWord);
  
  // Set current node as not visited before being popped from the stack
	visited[i][j] = false; 
	 
};

// Check adjacent Grid
exports.checkAdjacentGrid = function(currentNode, i, j, visited, currentWord){
  if (this.isSafeToVisit(i, j, visited)){
		var character = this.grid[i][j].toLowerCase();
		if (character.length == 1 && character in currentNode.children){
			this.searchForWords(currentNode.children[character], i, j, visited, currentWord + character); 
		}
		else if (character.length>1){
			var characterInPrefixTree = true;
			var tempNode = currentNode;
			var k = 0;
			while (k < character.length && characterInPrefixTree){
				(character[k] in tempNode.children) ? tempNode = tempNode.children[character[k]] : characterInPrefixTree = false;
				k++;
			}
			if (characterInPrefixTsree){
				this.searchForWords(tempNode, i, j, visited, currentWord + character);
			}
		}
	} 
}; 

