/**
 * Enriches src/data.json with problem descriptions, examples, constraints,
 * hints, and test cases from the provided markdown + JSON documents.
 * Run with: node scripts/enrich_data.js
 */
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../src/data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// ─── Problem descriptions keyed by lcNumber ───────────────────────────────
const descriptions = {
  1: {
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9, return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" }
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
    hints: ["A brute force approach checks all pairs — O(n²). Can you do better?", "Fix one number x, search for target-x. Can you make that search faster?", "Use a hash map to store seen values and look up target-x in O(1)."]
  },
  3: {
    description: "Given a string `s`, find the length of the longest substring without duplicate characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", length 3.' },
      { input: 's = "bbbbb"', output: "1" },
      { input: 's = "pwwkew"', output: "3" }
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    hints: ["Use a sliding window. Expand right pointer, shrink left when a duplicate is found.", "Track characters in a set or hash map for O(1) lookup."]
  },
  11: {
    description: "Given an integer array `height` of length `n`, find two lines that form a container holding the most water. Return the maximum amount of water.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" }
    ],
    constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    hints: ["O(n²) brute force works but is too slow.", "Use two pointers at both ends. Move the pointer with the smaller height inward.", "Area = min(height[l], height[r]) * (r - l)."]
  },
  15: {
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" }
    ],
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    hints: ["Fix one number, reduce to 2Sum on the rest.", "Sort first to skip duplicates easily.", "Use two pointers for the inner 2Sum loop."]
  },
  19: {
    description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    examples: [
      { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
      { input: "head = [1], n = 1", output: "[]" },
      { input: "head = [1,2], n = 1", output: "[1]" }
    ],
    constraints: ["1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"],
    hints: ["Use two pointers. Advance the fast pointer n steps ahead, then move both until fast reaches the end."]
  },
  23: {
    description: "You are given an array of k linked-lists, each sorted in ascending order. Merge all linked-lists into one sorted linked-list and return it.",
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
      { input: "lists = []", output: "[]" },
      { input: "lists = [[]]", output: "[]" }
    ],
    constraints: ["k == lists.length", "0 <= k <= 10^4", "-10^4 <= lists[i][j] <= 10^4"],
    hints: ["Use a min-heap (priority queue) of size k.", "Or divide and conquer: merge pairs of lists repeatedly."]
  },
  26: {
    description: "Given a sorted integer array nums in non-decreasing order, remove duplicates in-place so each unique element appears only once. Return the number of unique elements k.",
    examples: [
      { input: "nums = [1,1,2]", output: "2, nums = [1,2,_]" },
      { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5, nums = [0,1,2,3,4,_,_,_,_,_]" }
    ],
    constraints: ["1 <= nums.length <= 3 * 10^4", "-100 <= nums[i] <= 100", "nums is sorted in non-decreasing order."],
    hints: ["Two pointers: slow tracks last unique position, fast scans forward.", "When nums[fast] != nums[slow], increment slow and copy."]
  },
  33: {
    description: "There is an integer array nums sorted in ascending order (with distinct values), possibly rotated at unknown index k. Given nums after rotation and a target, return the index of target, or -1 if not found. Must be O(log n).",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
      { input: "nums = [1], target = 0", output: "-1" }
    ],
    constraints: ["1 <= nums.length <= 5000", "All values unique", "O(log n) required"],
    hints: ["One half is always sorted. Check which half and decide where target lies."]
  },
  34: {
    description: "Given a sorted array nums and a target, find the starting and ending position of target. If not found return [-1, -1]. Must be O(log n).",
    examples: [
      { input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]" },
      { input: "nums = [5,7,7,8,8,10], target = 6", output: "[-1,-1]" },
      { input: "nums = [], target = 0", output: "[-1,-1]" }
    ],
    constraints: ["0 <= nums.length <= 10^5", "nums is non-decreasing", "O(log n) required"],
    hints: ["Run two binary searches: one for leftmost occurrence, one for rightmost."]
  },
  39: {
    description: "Given an array of distinct integers candidates and a target integer, return all unique combinations where chosen numbers sum to target. The same number may be used unlimited times.",
    examples: [
      { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
      { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" },
      { input: "candidates = [2], target = 1", output: "[]" }
    ],
    constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "1 <= target <= 40"],
    hints: ["Backtrack: at each step pick a candidate (or skip it). Allow reuse by not incrementing start index."]
  },
  45: {
    description: "Given a 0-indexed array nums where each element is the max jump length from that index, return the minimum number of jumps to reach the last index.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "2" },
      { input: "nums = [2,3,0,1,4]", output: "2" }
    ],
    constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000", "It's guaranteed you can reach the last index."],
    hints: ["Greedy: track the farthest reachable index. Each time you exhaust the current jump range, increment jumps."]
  },
  49: {
    description: "Given an array of strings strs, group the anagrams together. Return the grouped anagrams in any order.",
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' }
    ],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
    hints: ["Canonical form: sort each string's characters. Strings with the same sorted form are anagrams."]
  },
  51: {
    description: "The n-queens puzzle: place n queens on an n×n chessboard so no two queens attack each other. Return all distinct solutions.",
    examples: [
      { input: "n = 4", output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { input: "n = 1", output: '[["Q"]]' }
    ],
    constraints: ["1 <= n <= 9"],
    hints: ["Backtrack row by row. Track used columns and diagonals to prune invalid placements."]
  },
  54: {
    description: "Given an m×n matrix, return all elements in spiral order.",
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" },
      { input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]" }
    ],
    constraints: ["1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"],
    hints: ["Maintain four boundaries (top, bottom, left, right). Traverse each boundary, then shrink inward."]
  },
  62: {
    description: "A robot on an m×n grid starts at top-left and moves only right or down. Return the number of unique paths to reach bottom-right.",
    examples: [
      { input: "m = 3, n = 7", output: "28" },
      { input: "m = 3, n = 2", output: "3" }
    ],
    constraints: ["1 <= m, n <= 100"],
    hints: ["DP: dp[i][j] = dp[i-1][j] + dp[i][j-1]. First row and column are all 1s."]
  },
  64: {
    description: "Given an m×n grid of non-negative numbers, find a path from top-left to bottom-right (only right or down) that minimizes the sum of all numbers along the path.",
    examples: [
      { input: "grid = [[1,3,1],[1,5,1],[4,2,1]]", output: "7" },
      { input: "grid = [[1,2,3],[4,5,6]]", output: "12" }
    ],
    constraints: ["1 <= m, n <= 200", "0 <= grid[i][j] <= 200"],
    hints: ["DP in-place: grid[i][j] += min(grid[i-1][j], grid[i][j-1])."]
  },
  74: {
    description: "Given an m×n integer matrix where each row is sorted and the first integer of each row is greater than the last of the previous row, return true if target is in the matrix. Must be O(log(m*n)).",
    examples: [
      { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true" },
      { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", output: "false" }
    ],
    constraints: ["1 <= m, n <= 100", "O(log(m*n)) required"],
    hints: ["Treat the matrix as a flattened sorted array. Binary search on indices 0..m*n-1, convert mid to row/col with divmod."]
  },
  75: {
    description: "Given an array nums with n objects colored red (0), white (1), or blue (2), sort them in-place in that order without using the library sort function.",
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
      { input: "nums = [2,0,1]", output: "[0,1,2]" }
    ],
    constraints: ["1 <= n <= 300", "nums[i] is 0, 1, or 2"],
    hints: ["Dutch National Flag algorithm: three pointers low, mid, high. Swap 0s to front, 2s to back."]
  },
  78: {
    description: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution must not contain duplicate subsets.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
      { input: "nums = [0]", output: "[[],[0]]" }
    ],
    constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All numbers unique."],
    hints: ["Backtrack: at each index decide to include or exclude. Or iteratively add each number to all existing subsets."]
  },
  79: {
    description: "Given an m×n grid of characters and a string word, return true if word exists in the grid. The word can be constructed from sequentially adjacent cells (horizontal/vertical). Each cell may not be used more than once.",
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true" },
      { input: 'word = "SEE"', output: "true" },
      { input: 'word = "ABCB"', output: "false" }
    ],
    constraints: ["1 <= m, n <= 6", "1 <= word.length <= 15"],
    hints: ["DFS from each cell. Mark visited cells temporarily. Backtrack if a path fails."]
  },
  88: {
    description: "You are given two sorted arrays nums1 (length m+n) and nums2 (length n). Merge nums2 into nums1 in-place in sorted order.",
    examples: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
      { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]" },
      { input: "nums1 = [0], m = 0, nums2 = [1], n = 1", output: "[1]" }
    ],
    constraints: ["nums1.length == m + n", "0 <= m, n <= 200", "-10^9 <= nums1[i], nums2[j] <= 10^9"],
    hints: ["Merge from the end to avoid overwriting elements. Three pointers: p1=m-1, p2=n-1, p3=m+n-1."]
  },
  98: {
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST: left subtree has only keys < node's key; right subtree has only keys > node's key; both subtrees are also BSTs.",
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "Root is 5 but right child is 4." }
    ],
    constraints: ["1 <= nodes <= 10^4", "-2^31 <= Node.val <= 2^31 - 1"],
    hints: ["In-order traversal should produce strictly increasing values.", "Pass min/max bounds recursively: left must be < node, right must be > node."]
  },
  101: {
    description: "Given the root of a binary tree, check whether it is a mirror of itself (symmetric around its center).",
    examples: [
      { input: "root = [1,2,2,3,4,4,3]", output: "true" },
      { input: "root = [1,2,2,null,3,null,3]", output: "false" }
    ],
    constraints: ["1 <= nodes <= 1000", "-100 <= Node.val <= 100"],
    hints: ["Recursive: left.left mirrors right.right, left.right mirrors right.left.", "Iterative: use a queue with pairs of nodes to compare."]
  },
  102: {
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values (left to right, level by level).",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
      { input: "root = [1]", output: "[[1]]" },
      { input: "root = []", output: "[]" }
    ],
    constraints: ["0 <= nodes <= 2000", "-1000 <= Node.val <= 1000"],
    hints: ["BFS with a queue. At each level, process all nodes in the current queue batch before adding their children."]
  },
  110: {
    description: "Given a binary tree, determine if it is height-balanced (the depth of the two subtrees of every node differs by at most 1).",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "true" },
      { input: "root = [1,2,2,3,3,null,null,4,4]", output: "false" },
      { input: "root = []", output: "true" }
    ],
    constraints: ["0 <= nodes <= 5000", "-10^4 <= Node.val <= 10^4"],
    hints: ["DFS returning height. If any subtree is unbalanced, propagate -1 upward to short-circuit."]
  },
  113: {
    description: "Given the root of a binary tree and targetSum, return all root-to-leaf paths where the sum of node values equals targetSum.",
    examples: [
      { input: "root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22", output: "[[5,4,11,2],[5,8,4,5]]" },
      { input: "root = [1,2,3], targetSum = 5", output: "[]" }
    ],
    constraints: ["0 <= nodes <= 5000", "-1000 <= Node.val, targetSum <= 1000"],
    hints: ["DFS + backtracking. Add node to path, subtract from remaining sum. At leaf, check if remaining == 0."]
  },
  124: {
    description: "A path in a binary tree is a sequence of nodes where each adjacent pair is connected. Return the maximum path sum of any non-empty path (path doesn't need to go through root).",
    examples: [
      { input: "root = [1,2,3]", output: "6" },
      { input: "root = [-10,9,20,null,null,15,7]", output: "42" }
    ],
    constraints: ["1 <= nodes <= 3 * 10^4", "-1000 <= Node.val <= 1000"],
    hints: ["Post-order DFS. At each node, max contribution upward = node.val + max(0, left, right). Max path through node = node.val + max(0,left) + max(0,right). Update global max."]
  },
  127: {
    description: "Given beginWord, endWord and wordList, return the number of words in the shortest transformation sequence from beginWord to endWord where each step changes exactly one letter and every intermediate word is in wordList. Return 0 if no sequence exists.",
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: "5" },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: "0" }
    ],
    constraints: ["1 <= beginWord.length <= 10", "1 <= wordList.length <= 5000"],
    hints: ["BFS from beginWord. For each word, try changing every character (a-z). If the new word is in wordList, add to queue and remove from set."]
  },
  129: {
    description: "Given the root of a binary tree with digits 0-9, where each root-to-leaf path represents a number, return the total sum of all root-to-leaf numbers.",
    examples: [
      { input: "root = [1,2,3]", output: "25", explanation: "12 + 13 = 25" },
      { input: "root = [4,9,0,5,1]", output: "1026" }
    ],
    constraints: ["1 <= nodes <= 1000", "0 <= Node.val <= 9", "depth <= 10"],
    hints: ["DFS passing current accumulated number. At leaf, add to total. current = current * 10 + node.val."]
  },
  131: {
    description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitionings.",
    examples: [
      { input: 's = "aab"', output: '[["a","a","b"],["aa","b"]]' },
      { input: 's = "a"', output: '[["a"]]' }
    ],
    constraints: ["1 <= s.length <= 16", "s contains only lowercase English letters."],
    hints: ["Backtrack: from current index, try every possible palindromic prefix and recurse on the suffix."]
  },
  142: {
    description: "Given the head of a linked list, return the node where a cycle begins, or null if there is no cycle.",
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "tail connects to node index 1" },
      { input: "head = [1,2], pos = 0", output: "tail connects to node index 0" },
      { input: "head = [1], pos = -1", output: "no cycle" }
    ],
    constraints: ["0 <= nodes <= 10^4", "pos is -1 or valid index"],
    hints: ["Floyd's: fast+slow meet inside cycle. Reset slow to head, advance both one step at a time — they meet at the cycle start."]
  },
  143: {
    description: "Reorder a singly linked list L0→L1→…→Ln-1→Ln to L0→Ln→L1→Ln-1→L2→Ln-2→…. Do not modify node values.",
    examples: [
      { input: "head = [1,2,3,4]", output: "[1,4,2,3]" },
      { input: "head = [1,2,3,4,5]", output: "[1,5,2,4,3]" }
    ],
    constraints: ["1 <= nodes <= 5 * 10^4", "1 <= Node.val <= 1000"],
    hints: ["Find mid with slow/fast. Reverse the second half. Merge both halves alternately."]
  },
  153: {
    description: "Given a sorted array rotated between 1 and n times, return the minimum element. Must run in O(log n).",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
      { input: "nums = [11,13,15,17]", output: "11" }
    ],
    constraints: ["1 <= n <= 5000", "All integers unique", "O(log n) required"],
    hints: ["Binary search. If nums[mid] > nums[right], minimum is in right half. Otherwise in left half (including mid)."]
  },
  155: {
    description: "Design a stack supporting push, pop, top, and getMin in O(1) time.",
    examples: [
      { input: '["MinStack","push","push","push","getMin","pop","top","getMin"] with values [[-2],[0],[-3],[],[],[],[]]', output: "[null,null,null,null,-3,null,0,-2]" }
    ],
    constraints: ["-2^31 <= val <= 2^31-1", "At most 3 * 10^4 calls"],
    hints: ["Maintain a second stack that tracks the minimum at each level. Push min onto it when push is called, pop it when pop is called."]
  },
  160: {
    description: "Given heads of two singly linked lists, return the node where they intersect. Return null if no intersection. Lists must retain original structure after.",
    examples: [
      { input: "intersectVal=8, listA=[4,1,8,4,5], listB=[5,6,1,8,4,5]", output: "Intersected at '8'" },
      { input: "intersectVal=0, listA=[2,6,4], listB=[1,5]", output: "No intersection" }
    ],
    constraints: ["1 <= m, n <= 3 * 10^4", "O(m+n) time, O(1) memory preferred"],
    hints: ["Two pointers: when one reaches end, redirect to other list's head. They meet at intersection after at most m+n steps."]
  },
  162: {
    description: "A peak element is strictly greater than its neighbors. Given nums, return the index of any peak element. Must be O(log n).",
    examples: [
      { input: "nums = [1,2,3,1]", output: "2" },
      { input: "nums = [1,2,1,3,5,6,4]", output: "5" }
    ],
    constraints: ["1 <= nums.length <= 1000", "nums[i] != nums[i+1]"],
    hints: ["Binary search: if nums[mid] < nums[mid+1], peak is on right. Otherwise on left (including mid)."]
  },
  198: {
    description: "You are a robber. Each house has money. You can't rob adjacent houses (triggers alarm). Return the maximum money you can rob.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "4" },
      { input: "nums = [2,7,9,3,1]", output: "12" }
    ],
    constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
    hints: ["DP: rob[i] = max(rob[i-1], rob[i-2] + nums[i]). Only need previous two values."]
  },
  199: {
    description: "Given the root of a binary tree, imagine standing on the right side. Return values of nodes visible from the right side, top to bottom.",
    examples: [
      { input: "root = [1,2,3,null,5,null,4]", output: "[1,3,4]" },
      { input: "root = [1,null,3]", output: "[1,3]" }
    ],
    constraints: ["0 <= nodes <= 100", "-100 <= Node.val <= 100"],
    hints: ["BFS level order. Take the last node of each level. Or DFS right-first, record first node seen at each depth."]
  },
  200: {
    description: "Given an m×n binary grid of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and connected horizontally/vertically.",
    examples: [
      { input: "grid with one connected landmass", output: "1" },
      { input: "grid with three separate landmasses", output: "3" }
    ],
    constraints: ["1 <= m, n <= 300", "grid[i][j] is '0' or '1'"],
    hints: ["DFS/BFS from each unvisited '1'. Mark visited cells as '0' (or seen). Count how many times you start a new DFS."]
  },
  205: {
    description: "Two strings s and t are isomorphic if characters in s can be replaced to get t. All occurrences must be replaced consistently; no two characters may map to the same character.",
    examples: [
      { input: 's = "egg", t = "add"', output: "true" },
      { input: 's = "foo", t = "bar"', output: "false" },
      { input: 's = "paper", t = "title"', output: "true" }
    ],
    constraints: ["1 <= s.length <= 5 * 10^4", "s.length == t.length"],
    hints: ["Maintain two maps: s→t and t→s. If a character is seen before with a different mapping, return false."]
  },
  206: {
    description: "Given the head of a singly linked list, reverse the list and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
      { input: "head = []", output: "[]" }
    ],
    constraints: ["0 <= nodes <= 5000", "-5000 <= Node.val <= 5000"],
    hints: ["Iterative: prev=null, curr=head. Each step: next=curr.next, curr.next=prev, prev=curr, curr=next.", "Recursive: reverse(head.next), then head.next.next=head, head.next=null."]
  },
  207: {
    description: "There are numCourses courses (0 to numCourses-1) and prerequisites [a,b] meaning you must take b before a. Return true if you can finish all courses.",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" }
    ],
    constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
    hints: ["Equivalent to cycle detection in a directed graph. Use DFS with states: unvisited/visiting/visited. Cycle = impossible."]
  },
  208: {
    description: "Implement a Trie (prefix tree) with insert, search, and startsWith operations.",
    examples: [
      { input: 'insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")', output: "[true, false, true, true]" }
    ],
    constraints: ["1 <= word.length, prefix.length <= 2000", "At most 3 * 10^4 calls total"],
    hints: ["Each node has a dict of children and a is_end flag. insert walks/creates nodes. search walks and checks is_end. startsWith just walks."]
  },
  215: {
    description: "Given an integer array nums and integer k, return the kth largest element in the array (not kth distinct).",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" }
    ],
    constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints: ["Min-heap of size k: push elements, pop when size exceeds k. Top of heap is answer.", "QuickSelect: partition and recurse on correct side. Average O(n)."]
  },
  232: {
    description: "Implement a FIFO queue using only two stacks. Support push, pop, peek, and empty operations.",
    examples: [
      { input: 'push(1), push(2), peek(), pop(), empty()', output: "[1, 1, false]" }
    ],
    constraints: ["1 <= x <= 9", "At most 100 calls", "All calls to pop and peek are valid"],
    hints: ["Two stacks: inbox and outbox. Push to inbox. For pop/peek, if outbox empty, pour inbox into outbox (reversing order). Amortized O(1)."]
  },
  238: {
    description: "Given integer array nums, return an array where answer[i] is the product of all elements except nums[i]. Must run in O(n) without division.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }
    ],
    constraints: ["2 <= nums.length <= 10^5", "O(n) required, no division"],
    hints: ["Two passes: first build prefix products, then suffix products. answer[i] = prefix[i] * suffix[i]."]
  },
  253: {
    description: "Given an array of meeting time intervals [start, end], return the minimum number of conference rooms required.",
    examples: [
      { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2" },
      { input: "intervals = [[7,10],[2,4]]", output: "1" }
    ],
    constraints: ["1 <= intervals.length <= 10^4"],
    hints: ["Sort by start time. Use a min-heap of end times. If earliest ending room is free (end <= current start), reuse it; otherwise add a new room."]
  },
  256: {
    description: "There are n houses in a row, each can be painted red, blue, or green. Adjacent houses cannot have the same color. Given costs[i][j] (cost to paint house i with color j), return the minimum cost to paint all houses.",
    examples: [
      { input: "costs = [[17,2,17],[16,16,5],[14,3,19]]", output: "10" }
    ],
    constraints: ["costs.length >= 1", "costs[i].length == 3"],
    hints: ["DP: costs[i][0] += min(costs[i-1][1], costs[i-1][2]). Accumulate in-place from left to right."]
  },
  268: {
    description: "Given an array nums containing n distinct numbers in range [0, n], return the only number in range missing from the array.",
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" },
      { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8" }
    ],
    constraints: ["n == nums.length", "0 <= nums[i] <= n", "All numbers unique"],
    hints: ["Math: expected sum = n*(n+1)/2, subtract actual sum.", "XOR: XOR all indices and all values — duplicates cancel, missing number remains."]
  },
  289: {
    description: "The Game of Life: given an m×n board of live (1) and dead (0) cells, apply all four rules simultaneously. Update the board to its next state in-place.",
    examples: [
      { input: "board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]", output: "[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]" }
    ],
    constraints: ["1 <= m, n <= 25", "board[i][j] is 0 or 1"],
    hints: ["Use extra states (2 = was alive, dies; 3 = was dead, becomes alive) to encode both old and new state simultaneously."]
  },
  322: {
    description: "Given an integer array coins of denominations and an integer amount, return the fewest coins needed to make that amount. Return -1 if impossible.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3" },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" }
    ],
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31-1", "0 <= amount <= 10^4"],
    hints: ["Bottom-up DP: dp[i] = min coins to make amount i. dp[i] = min(dp[i], dp[i-coin]+1) for each coin."]
  },
  347: {
    description: "Given integer array nums and integer k, return the k most frequent elements. Answer is guaranteed to be unique.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" }
    ],
    constraints: ["1 <= nums.length <= 10^5", "k is in range [1, unique element count]"],
    hints: ["Count frequencies, then use a min-heap of size k. Or bucket sort by frequency (O(n))."]
  },
  409: {
    description: "Given a string s of lowercase and uppercase letters, return the length of the longest palindrome that can be built with those letters.",
    examples: [
      { input: 's = "abccccdd"', output: "7", explanation: '"dccaccd"' },
      { input: 's = "a"', output: "1" }
    ],
    constraints: ["1 <= s.length <= 2000"],
    hints: ["Count character frequencies. All even-count chars can be used fully. One odd-count char can go in the middle. Sum = sum of all floors + 1 if any odd count exists."]
  },
  429: {
    description: "Given an n-ary tree, return the level order traversal of its nodes' values.",
    examples: [
      { input: "root = [1,null,3,2,4,null,5,6]", output: "[[1],[3,2,4],[5,6]]" }
    ],
    constraints: ["Height <= 1000", "0 <= nodes <= 10^4"],
    hints: ["BFS with a queue. Process all nodes at each level, enqueue their children."]
  },
  438: {
    description: "Given strings s and p, return all start indices of p's anagrams in s.",
    examples: [
      { input: 's = "cbaebabacd", p = "abc"', output: "[0,6]" },
      { input: 's = "abab", p = "ab"', output: "[0,1,2]" }
    ],
    constraints: ["1 <= s.length, p.length <= 3 * 10^4"],
    hints: ["Sliding window of size len(p). Compare character frequency arrays. Slide and update counts."]
  },
  448: {
    description: "Given array nums of n integers where nums[i] is in [1,n], return all integers in [1,n] that do not appear in nums.",
    examples: [
      { input: "nums = [4,3,2,7,8,2,3,1]", output: "[5,6]" },
      { input: "nums = [1,1]", output: "[2]" }
    ],
    constraints: ["1 <= n <= 10^5", "1 <= nums[i] <= n"],
    hints: ["Mark visited: negate nums[nums[i]-1]. Then collect all indices with positive values (0-indexed, add 1)."]
  },
  498: {
    description: "Given an m×n matrix mat, return all elements in diagonal order (alternating up-right and down-left diagonals).",
    examples: [
      { input: "mat = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,4,7,5,3,6,8,9]" }
    ],
    constraints: ["1 <= m, n <= 10^4", "1 <= m*n <= 10^4"],
    hints: ["Track current direction. When going up-right, if hit top or right edge, switch to down-left. Adjust row/col boundaries accordingly."]
  },
  503: {
    description: "Given a circular integer array nums, return the next greater number for every element. If none exists, return -1.",
    examples: [
      { input: "nums = [1,2,1]", output: "[2,-1,2]" },
      { input: "nums = [1,2,3,4,3]", output: "[2,3,4,-1,4]" }
    ],
    constraints: ["1 <= nums.length <= 10^4"],
    hints: ["Monotonic stack. Iterate 2*n times (using mod). Push indices, pop when a larger element is found."]
  },
  525: {
    description: "Given a binary array nums, return the maximum length of a contiguous subarray with equal number of 0s and 1s.",
    examples: [
      { input: "nums = [0,1]", output: "2" },
      { input: "nums = [0,1,0]", output: "2" }
    ],
    constraints: ["1 <= nums.length <= 10^5", "nums[i] is 0 or 1"],
    hints: ["Replace 0s with -1, compute prefix sums. If the same prefix sum appears at index i and j, subarray [i+1..j] has equal 0s and 1s. Use a hash map to store first occurrence."]
  },
  542: {
    description: "Given an m×n binary matrix mat, return the distance of the nearest 0 for each cell.",
    examples: [
      { input: "mat = [[0,0,0],[0,1,0],[0,0,0]]", output: "[[0,0,0],[0,1,0],[0,0,0]]" },
      { input: "mat = [[0,0,0],[0,1,0],[1,1,1]]", output: "[[0,0,0],[0,1,0],[1,2,1]]" }
    ],
    constraints: ["1 <= m, n <= 10^4", "At least one 0 in mat"],
    hints: ["Multi-source BFS: start from all 0s simultaneously. Distance to each cell is its BFS level."]
  },
  560: {
    description: "Given integer array nums and integer k, return the total number of subarrays whose sum equals k.",
    examples: [
      { input: "nums = [1,1,1], k = 2", output: "2" },
      { input: "nums = [1,2,3], k = 3", output: "2" }
    ],
    constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000"],
    hints: ["Prefix sum + hash map. If prefix[j] - prefix[i] = k, then subarray [i+1..j] sums to k. Store prefix sum counts."]
  },
  690: {
    description: "Each employee has an id, importance value, and list of direct subordinate IDs. Given an id, return the total importance of that employee plus all direct and indirect subordinates.",
    examples: [
      { input: "employees = [[1,5,[2,3]],[2,3,[]],[3,3,[]]], id = 1", output: "11" }
    ],
    constraints: ["1 <= employees.length <= 2000", "-100 <= importance <= 100"],
    hints: ["BFS/DFS from the given employee. Accumulate importance values as you traverse the subordinate tree."]
  },
  705: {
    description: "Design a HashSet without using built-in hash table libraries. Support add(key), contains(key), and remove(key).",
    examples: [
      { input: "add(1), add(2), contains(1), contains(3), remove(2), contains(2)", output: "[true, false, false]" }
    ],
    constraints: ["0 <= key <= 10^6", "At most 10^4 calls"],
    hints: ["Array of linked lists (chaining). Hash = key % bucket_size. Handle collisions within each bucket."]
  },
  706: {
    description: "Design a HashMap without built-in hash table libraries. Support put(key,value), get(key), and remove(key).",
    examples: [
      { input: "put(1,1), put(2,2), get(1), get(3), put(2,1), get(2), remove(2), get(2)", output: "[1, -1, 1, -1]" }
    ],
    constraints: ["0 <= key, value <= 10^6", "At most 10^4 calls"],
    hints: ["Array of linked lists (chaining) with (key, value) pairs. Same bucket approach as HashSet."]
  },
  733: {
    description: "Given an image (m×n grid), perform a flood fill starting from pixel (sr,sc): change its color to `color` and recursively change all 4-directionally adjacent pixels of the same original color.",
    examples: [
      { input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2", output: "[[2,2,2],[2,2,0],[2,0,1]]" }
    ],
    constraints: ["1 <= m, n <= 50", "0 <= image[i][j], color < 2^16"],
    hints: ["DFS/BFS from (sr,sc). Only change cells matching the original color. Handle the edge case where starting color equals new color."]
  },
  739: {
    description: "Given array temperatures, return an array where answer[i] is the number of days until a warmer temperature. If no warmer future day, answer[i] = 0.",
    examples: [
      { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
      { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" }
    ],
    constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
    hints: ["Monotonic stack of indices. For each temperature, pop all smaller temperatures from stack and compute their wait days."]
  },
  740: {
    description: "Given integer array nums, each operation: pick nums[i], earn nums[i] points, delete all elements equal to nums[i]-1 and nums[i]+1. Maximize total points.",
    examples: [
      { input: "nums = [3,4,2]", output: "6" },
      { input: "nums = [2,2,3,3,3,4]", output: "9" }
    ],
    constraints: ["1 <= nums.length <= 2 * 10^4", "1 <= nums[i] <= 10^4"],
    hints: ["Reduce to House Robber: bucket[v] = v * count(v). You can't take adjacent buckets. dp[i] = max(dp[i-1], dp[i-2] + bucket[i])."]
  },
  863: {
    description: "Given a binary tree, a target node value, and integer k, return all node values that are exactly k distance from the target node.",
    examples: [
      { input: "root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2", output: "[7,4,1]" }
    ],
    constraints: ["1 <= nodes <= 500", "All Node.val are unique", "0 <= k <= 1000"],
    hints: ["Build a parent map (to traverse upward). Then BFS from target node in all 3 directions (left child, right child, parent) for k steps."]
  },
  931: {
    description: "Given n×n matrix, return the minimum sum of any falling path through it. A falling path starts at any element in row 0 and at each step moves to the row below (directly below or one diagonal step left/right).",
    examples: [
      { input: "matrix = [[2,1,3],[6,5,4],[7,8,9]]", output: "13" },
      { input: "matrix = [[-19,57],[-40,-5]]", output: "-59" }
    ],
    constraints: ["1 <= n <= 100", "-100 <= matrix[i][j] <= 100"],
    hints: ["DP in-place. matrix[i][j] += min(matrix[i-1][j-1], matrix[i-1][j], matrix[i-1][j+1]) (clamping at edges). Answer is min of last row."]
  },
  993: {
    description: "Two nodes are cousins if they have the same depth but different parents. Given the binary tree root and two node values x and y, return true if x and y are cousins.",
    examples: [
      { input: "root = [1,2,3,4], x = 4, y = 3", output: "false" },
      { input: "root = [1,2,3,null,4,null,5], x = 5, y = 4", output: "true" }
    ],
    constraints: ["2 <= nodes <= 100", "x != y", "x and y both exist in tree"],
    hints: ["BFS level order. Check that x and y are at the same level but have different parents."]
  },
  994: {
    description: "Given an m×n grid where 0=empty, 1=fresh orange, 2=rotten orange, every minute fresh oranges 4-directionally adjacent to rotten ones become rotten. Return minimum minutes until no fresh orange remains, or -1 if impossible.",
    examples: [
      { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
      { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" }
    ],
    constraints: ["1 <= m, n <= 10", "grid[i][j] is 0, 1, or 2"],
    hints: ["Multi-source BFS from all rotten oranges simultaneously. Count fresh oranges. If any remain after BFS, return -1."]
  },
  997: {
    description: "In a town of n people (1..n), the town judge trusts nobody and everybody else trusts the judge. Given trust pairs [a,b], return the judge's label or -1.",
    examples: [
      { input: "n = 2, trust = [[1,2]]", output: "2" },
      { input: "n = 3, trust = [[1,3],[2,3]]", output: "3" },
      { input: "n = 3, trust = [[1,3],[2,3],[3,1]]", output: "-1" }
    ],
    constraints: ["1 <= n <= 1000", "0 <= trust.length <= 10^4"],
    hints: ["Track in-degree and out-degree. Judge has in-degree = n-1 and out-degree = 0."]
  },
  1143: {
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. If none exists, return 0.",
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: "3" },
      { input: 'text1 = "abc", text2 = "abc"', output: "3" },
      { input: 'text1 = "abc", text2 = "def"', output: "0" }
    ],
    constraints: ["1 <= text1.length, text2.length <= 1000"],
    hints: ["DP: dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]. If chars match, dp[i][j] = dp[i-1][j-1]+1. Otherwise max(dp[i-1][j], dp[i][j-1])."]
  },
  1192: {
    description: "Given n servers and connections between them, a critical connection is one whose removal disconnects some servers. Return all critical connections.",
    examples: [
      { input: "n=4, connections=[[0,1],[1,2],[2,0],[1,3]]", output: "[[1,3]]" },
      { input: "n=2, connections=[[0,1]]", output: "[[0,1]]" }
    ],
    constraints: ["2 <= n <= 10^5", "n-1 <= connections.length <= 10^5"],
    hints: ["Tarjan's bridge-finding algorithm. Track discovery time and low value. Edge (u,v) is a bridge if low[v] > disc[u]."]
  }
};

// ─── Test cases keyed by lcNumber ─────────────────────────────────────────
const testCases = {
  88: [
    { id:1, input:"[1,2,3,0,0,0]\n3\n[2,5,6]\n3", expected:"[1,2,2,3,5,6]" },
    { id:2, input:"[1]\n1\n[]\n0", expected:"[1]" },
    { id:3, input:"[0]\n0\n[1]\n1", expected:"[1]" },
    { id:4, input:"[4,5,6,0,0,0]\n3\n[1,2,3]\n3", expected:"[1,2,3,4,5,6]" },
    { id:5, input:"[-1,0,0,3,3,3,0,0,0]\n6\n[1,2,2]\n3", expected:"[-1,0,0,1,2,2,3,3,3]" }
  ],
  15: [
    { id:1, input:"[-1,0,1,2,-1,-4]", expected:"[[-1,-1,2],[-1,0,1]]" },
    { id:2, input:"[0,1,1]", expected:"[]" },
    { id:3, input:"[0,0,0]", expected:"[[0,0,0]]" }
  ],
  98: [
    { id:1, input:"[2,1,3]", expected:"true" },
    { id:2, input:"[5,1,4,null,null,3,6]", expected:"false" },
    { id:3, input:"[0]", expected:"true" }
  ],
  256: [
    { id:1, input:"[[17,2,17],[16,16,5],[14,3,19]]", expected:"10" }
  ],
  198: [
    { id:1, input:"[1,2,3,1]", expected:"4" },
    { id:2, input:"[2,7,9,3,1]", expected:"12" },
    { id:3, input:"[0]", expected:"0" },
    { id:4, input:"[1,2]", expected:"2" }
  ],
  131: [
    { id:1, input:'"aab"', expected:'[["a","a","b"],["aa","b"]]' },
    { id:2, input:'"a"', expected:'[["a"]]' },
    { id:3, input:'"bb"', expected:'[["b","b"],["bb"]]' }
  ],
  79: [
    { id:1, input:'[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCCED"', expected:"true" },
    { id:2, input:'[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"SEE"', expected:"true" },
    { id:3, input:'[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCB"', expected:"false" }
  ],
  206: [
    { id:1, input:"[1,2,3,4,5]", expected:"[5,4,3,2,1]" },
    { id:2, input:"[1,2]", expected:"[2,1]" },
    { id:3, input:"[]", expected:"[]" }
  ],
  142: [
    { id:1, input:"[3,2,0,-4]\n1", expected:"tail connects to node index 1" },
    { id:2, input:"[1,2]\n0", expected:"tail connects to node index 0" },
    { id:3, input:"[1]\n-1", expected:"no cycle" }
  ],
  124: [
    { id:1, input:"[1,2,3]", expected:"6" },
    { id:2, input:"[-10,9,20,null,null,15,7]", expected:"42" }
  ],
  289: [
    { id:1, input:"[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]", expected:"[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]" },
    { id:2, input:"[[1,1],[1,0]]", expected:"[[1,1],[1,1]]" }
  ],
  11: [
    { id:1, input:"[1,8,6,2,5,4,8,3,7]", expected:"49" },
    { id:2, input:"[1,1]", expected:"1" },
    { id:3, input:"[4,3,2,1,4]", expected:"16" }
  ],
  153: [
    { id:1, input:"[3,4,5,1,2]", expected:"1" },
    { id:2, input:"[4,5,6,7,0,1,2]", expected:"0" },
    { id:3, input:"[11,13,15,17]", expected:"11" }
  ],
  268: [
    { id:1, input:"[3,0,1]", expected:"2" },
    { id:2, input:"[0,1]", expected:"2" },
    { id:3, input:"[9,6,4,2,3,5,7,0,1]", expected:"8" }
  ],
  34: [
    { id:1, input:"[5,7,7,8,8,10]\n8", expected:"[3,4]" },
    { id:2, input:"[5,7,7,8,8,10]\n6", expected:"[-1,-1]" },
    { id:3, input:"[]\n0", expected:"[-1,-1]" }
  ],
  994: [
    { id:1, input:"[[2,1,1],[1,1,0],[0,1,1]]", expected:"4" },
    { id:2, input:"[[2,1,1],[0,1,1],[1,0,1]]", expected:"-1" },
    { id:3, input:"[[0,2]]", expected:"0" }
  ],
  690: [
    { id:1, input:"[[1,5,[2,3]],[2,3,[]],[3,3,[]]]\n1", expected:"11" },
    { id:2, input:"[[1,2,[5]],[5,-3,[]]]\n5", expected:"-3" }
  ],
  1143: [
    { id:1, input:'"abcde"\n"ace"', expected:"3" },
    { id:2, input:'"abc"\n"abc"', expected:"3" },
    { id:3, input:'"abc"\n"def"', expected:"0" }
  ],
  45: [
    { id:1, input:"[2,3,1,1,4]", expected:"2" },
    { id:2, input:"[2,3,0,1,4]", expected:"2" },
    { id:3, input:"[0]", expected:"0" }
  ],
  525: [
    { id:1, input:"[0,1]", expected:"2" },
    { id:2, input:"[0,1,0]", expected:"2" },
    { id:3, input:"[0,1,1,1,1,1,0,0,0]", expected:"6" }
  ],
  409: [
    { id:1, input:'"abccccdd"', expected:"7" },
    { id:2, input:'"a"', expected:"1" },
    { id:3, input:'"bb"', expected:"2" }
  ],
  739: [
    { id:1, input:"[73,74,75,71,69,72,76,73]", expected:"[1,1,4,2,1,1,0,0]" },
    { id:2, input:"[30,40,50,60]", expected:"[1,1,1,0]" },
    { id:3, input:"[30,60,90]", expected:"[1,1,0]" }
  ],
  503: [
    { id:1, input:"[1,2,1]", expected:"[2,-1,2]" },
    { id:2, input:"[1,2,3,4,3]", expected:"[2,3,4,-1,4]" }
  ],
  102: [
    { id:1, input:"[3,9,20,null,null,15,7]", expected:"[[3],[9,20],[15,7]]" },
    { id:2, input:"[1]", expected:"[[1]]" },
    { id:3, input:"[]", expected:"[]" }
  ],
  199: [
    { id:1, input:"[1,2,3,null,5,null,4]", expected:"[1,3,4]" },
    { id:2, input:"[1,null,3]", expected:"[1,3]" }
  ],
  155: [
    { id:1, input:'["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', expected:"[null,null,null,null,-3,null,0,-2]" }
  ],
  706: [
    { id:1, input:'["MyHashMap","put","put","get","get","put","get","remove","get"]\n[[],[1,1],[2,2],[1],[3],[2,1],[2],[2],[2]]', expected:"[null,null,null,1,-1,null,1,null,-1]" }
  ],
  993: [
    { id:1, input:"[1,2,3,4]\n4\n3", expected:"false" },
    { id:2, input:"[1,2,3,null,4,null,5]\n5\n4", expected:"true" }
  ],
  101: [
    { id:1, input:"[1,2,2,3,4,4,3]", expected:"true" },
    { id:2, input:"[1,2,2,null,3,null,3]", expected:"false" }
  ],
  429: [
    { id:1, input:"[1,null,3,2,4,null,5,6]", expected:"[[1],[3,2,4],[5,6]]" }
  ],
  208: [
    { id:1, input:'["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', expected:"[null,null,true,false,true,null,true]" }
  ],
  207: [
    { id:1, input:"2\n[[1,0]]", expected:"true" },
    { id:2, input:"2\n[[1,0],[0,1]]", expected:"false" },
    { id:3, input:"1\n[]", expected:"true" }
  ],
  863: [
    { id:1, input:"[3,5,1,6,2,0,8,null,null,7,4]\n5\n2", expected:"[7,4,1]" },
    { id:2, input:"[1]\n1\n3", expected:"[]" }
  ],
  3: [
    { id:1, input:'"abcabcbb"', expected:"3" },
    { id:2, input:'"bbbbb"', expected:"1" },
    { id:3, input:'"pwwkew"', expected:"3" },
    { id:4, input:'""', expected:"0" }
  ],
  438: [
    { id:1, input:'"cbaebabacd"\n"abc"', expected:"[0,6]" },
    { id:2, input:'"abab"\n"ab"', expected:"[0,1,2]" }
  ],
  78: [
    { id:1, input:"[1,2,3]", expected:"[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
    { id:2, input:"[0]", expected:"[[],[0]]" }
  ],
  127: [
    { id:1, input:'"hit"\n"cog"\n["hot","dot","dog","lot","log","cog"]', expected:"5" },
    { id:2, input:'"hit"\n"cog"\n["hot","dot","dog","lot","log"]', expected:"0" }
  ],
  542: [
    { id:1, input:"[[0,0,0],[0,1,0],[0,0,0]]", expected:"[[0,0,0],[0,1,0],[0,0,0]]" },
    { id:2, input:"[[0,0,0],[0,1,0],[1,1,1]]", expected:"[[0,0,0],[0,1,0],[1,2,1]]" }
  ],
  733: [
    { id:1, input:"[[1,1,1],[1,1,0],[1,0,1]]\n1\n1\n2", expected:"[[2,2,2],[2,2,0],[2,0,1]]" },
    { id:2, input:"[[0,0,0],[0,0,0]]\n0\n0\n0", expected:"[[0,0,0],[0,0,0]]" }
  ],
  129: [
    { id:1, input:"[1,2,3]", expected:"25" },
    { id:2, input:"[4,9,0,5,1]", expected:"1026" }
  ],
  113: [
    { id:1, input:"[5,4,8,11,null,13,4,7,2,null,null,5,1]\n22", expected:"[[5,4,11,2],[5,8,4,5]]" },
    { id:2, input:"[1,2,3]\n5", expected:"[]" }
  ],
  347: [
    { id:1, input:"[1,1,1,2,2,3]\n2", expected:"[1,2]" },
    { id:2, input:"[1]\n1", expected:"[1]" },
    { id:3, input:"[-1,-1]\n1", expected:"[-1]" }
  ],
  62: [
    { id:1, input:"3\n7", expected:"28" },
    { id:2, input:"3\n2", expected:"3" }
  ],
  64: [
    { id:1, input:"[[1,3,1],[1,5,1],[4,2,1]]", expected:"7" },
    { id:2, input:"[[1,2,3],[4,5,6]]", expected:"12" }
  ],
  1: [
    { id:1, input:"[2,7,11,15]\n9", expected:"[0,1]" },
    { id:2, input:"[3,2,4]\n6", expected:"[1,2]" },
    { id:3, input:"[3,3]\n6", expected:"[0,1]" }
  ],
  75: [
    { id:1, input:"[2,0,2,1,1,0]", expected:"[0,0,1,1,2,2]" },
    { id:2, input:"[2,0,1]", expected:"[0,1,2]" }
  ],
  26: [
    { id:1, input:"[1,1,2]", expected:"2, nums = [1,2,_]" },
    { id:2, input:"[0,0,1,1,1,2,2,3,3,4]", expected:"5, nums = [0,1,2,3,4,_,_,_,_,_]" }
  ],
  160: [
    { id:1, input:"8\n[4,1,8,4,5]\n[5,6,1,8,4,5]\n2\n3", expected:"Intersected at '8'" },
    { id:2, input:"0\n[2,6,4]\n[1,5]\n3\n2", expected:"No intersection" }
  ],
  143: [
    { id:1, input:"[1,2,3,4]", expected:"[1,4,2,3]" },
    { id:2, input:"[1,2,3,4,5]", expected:"[1,5,2,4,3]" }
  ],
  19: [
    { id:1, input:"[1,2,3,4,5]\n2", expected:"[1,2,3,5]" },
    { id:2, input:"[1]\n1", expected:"[]" },
    { id:3, input:"[1,2]\n1", expected:"[1]" }
  ],
  51: [
    { id:1, input:"4", expected:'[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
    { id:2, input:"1", expected:'[["Q"]]' },
    { id:3, input:"2", expected:"[]" }
  ],
  232: [
    { id:1, input:'["MyQueue","push","push","peek","pop","empty"]\n[[],[1],[2],[],[],[]]', expected:"[null,null,null,1,1,false]" }
  ],
  705: [
    { id:1, input:'["MyHashSet","add","add","contains","contains","add","contains","remove","contains"]\n[[],[1],[2],[1],[3],[2],[2],[2],[2]]', expected:"[null,null,null,true,false,null,true,null,false]" }
  ],
  448: [
    { id:1, input:"[4,3,2,7,8,2,3,1]", expected:"[5,6]" },
    { id:2, input:"[1,1]", expected:"[2]" }
  ],
  740: [
    { id:1, input:"[3,4,2]", expected:"6" },
    { id:2, input:"[2,2,3,3,3,4]", expected:"9" }
  ],
  498: [
    { id:1, input:"[[1,2,3],[4,5,6],[7,8,9]]", expected:"[1,2,4,7,5,3,6,8,9]" },
    { id:2, input:"[[1,2],[3,4]]", expected:"[1,2,3,4]" }
  ],
  54: [
    { id:1, input:"[[1,2,3],[4,5,6],[7,8,9]]", expected:"[1,2,3,6,9,8,7,4,5]" },
    { id:2, input:"[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", expected:"[1,2,3,4,8,12,11,10,9,5,6,7]" }
  ],
  74: [
    { id:1, input:"[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n3", expected:"true" },
    { id:2, input:"[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n13", expected:"false" }
  ],
  33: [
    { id:1, input:"[4,5,6,7,0,1,2]\n0", expected:"4" },
    { id:2, input:"[4,5,6,7,0,1,2]\n3", expected:"-1" }
  ],
  49: [
    { id:1, input:'["eat","tea","tan","ate","nat","bat"]', expected:'[["bat"],["nat","tan"],["ate","eat","tea"]]' },
    { id:2, input:'[""]', expected:'[[""]]' }
  ],
  205: [
    { id:1, input:'"egg"\n"add"', expected:"true" },
    { id:2, input:'"foo"\n"bar"', expected:"false" },
    { id:3, input:'"paper"\n"title"', expected:"true" }
  ],
  560: [
    { id:1, input:"[1,1,1]\n2", expected:"2" },
    { id:2, input:"[1,2,3]\n3", expected:"2" }
  ],
  215: [
    { id:1, input:"[3,2,1,5,6,4]\n2", expected:"5" },
    { id:2, input:"[3,2,3,1,2,4,5,5,6]\n4", expected:"4" }
  ],
  23: [
    { id:1, input:"[[1,4,5],[1,3,4],[2,6]]", expected:"[1,1,2,3,4,4,5,6]" },
    { id:2, input:"[]", expected:"[]" }
  ],
  253: [
    { id:1, input:"[[0,30],[5,10],[15,20]]", expected:"2" },
    { id:2, input:"[[7,10],[2,4]]", expected:"1" }
  ],
  162: [
    { id:1, input:"[1,2,3,1]", expected:"2" },
    { id:2, input:"[1,2,1,3,5,6,4]", expected:"5" }
  ],
  39: [
    { id:1, input:"[2,3,6,7]\n7", expected:"[[2,2,3],[7]]" },
    { id:2, input:"[2,3,5]\n8", expected:"[[2,2,2,2],[2,3,3],[3,5]]" }
  ],
  931: [
    { id:1, input:"[[2,1,3],[6,5,4],[7,8,9]]", expected:"13" },
    { id:2, input:"[[-19,57],[-40,-5]]", expected:"-59" }
  ],
  238: [
    { id:1, input:"[1,2,3,4]", expected:"[24,12,8,6]" },
    { id:2, input:"[-1,1,0,-3,3]", expected:"[0,0,9,0,0]" }
  ],
  997: [
    { id:1, input:"2\n[[1,2]]", expected:"2" },
    { id:2, input:"3\n[[1,3],[2,3]]", expected:"3" },
    { id:3, input:"3\n[[1,3],[2,3],[3,1]]", expected:"-1" }
  ],
  200: [
    { id:1, input:'[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expected:"1" },
    { id:2, input:'[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected:"3" }
  ],
  1192: [
    { id:1, input:"4\n[[0,1],[1,2],[2,0],[1,3]]", expected:"[[1,3]]" },
    { id:2, input:"2\n[[0,1]]", expected:"[[0,1]]" }
  ],
  110: [
    { id:1, input:"[3,9,20,null,null,15,7]", expected:"true" },
    { id:2, input:"[1,2,2,3,3,null,null,4,4]", expected:"false" },
    { id:3, input:"[]", expected:"true" }
  ],
  322: [
    { id:1, input:"[1,2,5]\n11", expected:"3" },
    { id:2, input:"[2]\n3", expected:"-1" },
    { id:3, input:"[1]\n0", expected:"0" }
  ]
};

// ─── Apply to data ─────────────────────────────────────────────────────────
let enriched = 0;
const updated = data.map(lesson => ({
  ...lesson,
  problems: lesson.problems.map(problem => {
    const desc = descriptions[problem.lcNumber];
    const tc = testCases[problem.lcNumber];
    if (desc) enriched++;
    return {
      ...problem,
      ...(desc || {}),
      testCases: tc || []
    };
  })
}));

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2));
console.log(`Done. Enriched ${enriched} problems.`);
