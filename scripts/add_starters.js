/**
 * Adds methodName, paramTypes, and pythonStarter to each problem.
 * Run: node scripts/add_starters.js
 */
const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "../src/data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// methodName, paramTypes (for parsing), pythonStarter
const problemMeta = {
  1:    { method: "twoSum",             params: ["intarray","int"],           starter: "class Solution:\n    def twoSum(self, nums: list, target: int) -> list:\n        pass\n" },
  3:    { method: "lengthOfLongestSubstring", params: ["str"],              starter: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass\n" },
  11:   { method: "maxArea",            params: ["intarray"],                 starter: "class Solution:\n    def maxArea(self, height: list) -> int:\n        pass\n" },
  15:   { method: "threeSum",           params: ["intarray"],                 starter: "class Solution:\n    def threeSum(self, nums: list) -> list:\n        pass\n" },
  19:   { method: "removeNthFromEnd",   params: ["linkedlist","int"],         starter: "# ListNode is already defined for you\nclass Solution:\n    def removeNthFromEnd(self, head, n: int):\n        pass\n" },
  23:   { method: "mergeKLists",        params: ["linkedlistarray"],          starter: "# ListNode is already defined for you\nclass Solution:\n    def mergeKLists(self, lists: list):\n        pass\n" },
  26:   { method: "removeDuplicates",   params: ["intarray"],                 starter: "class Solution:\n    def removeDuplicates(self, nums: list) -> int:\n        pass\n" },
  33:   { method: "search",             params: ["intarray","int"],           starter: "class Solution:\n    def search(self, nums: list, target: int) -> int:\n        pass\n" },
  34:   { method: "searchRange",        params: ["intarray","int"],           starter: "class Solution:\n    def searchRange(self, nums: list, target: int) -> list:\n        pass\n" },
  39:   { method: "combinationSum",     params: ["intarray","int"],           starter: "class Solution:\n    def combinationSum(self, candidates: list, target: int) -> list:\n        pass\n" },
  45:   { method: "jump",               params: ["intarray"],                 starter: "class Solution:\n    def jump(self, nums: list) -> int:\n        pass\n" },
  49:   { method: "groupAnagrams",      params: ["strarray"],                 starter: "class Solution:\n    def groupAnagrams(self, strs: list) -> list:\n        pass\n" },
  51:   { method: "solveNQueens",       params: ["int"],                      starter: "class Solution:\n    def solveNQueens(self, n: int) -> list:\n        pass\n" },
  54:   { method: "spiralOrder",        params: ["int2darray"],               starter: "class Solution:\n    def spiralOrder(self, matrix: list) -> list:\n        pass\n" },
  62:   { method: "uniquePaths",        params: ["int","int"],                starter: "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        pass\n" },
  64:   { method: "minPathSum",         params: ["int2darray"],               starter: "class Solution:\n    def minPathSum(self, grid: list) -> int:\n        pass\n" },
  74:   { method: "searchMatrix",       params: ["int2darray","int"],         starter: "class Solution:\n    def searchMatrix(self, matrix: list, target: int) -> bool:\n        pass\n" },
  75:   { method: "sortColors",         params: ["intarray"],                 starter: "class Solution:\n    def sortColors(self, nums: list) -> None:\n        pass\n" },
  78:   { method: "subsets",            params: ["intarray"],                 starter: "class Solution:\n    def subsets(self, nums: list) -> list:\n        pass\n" },
  79:   { method: "exist",              params: ["charmatrix","str"],         starter: "class Solution:\n    def exist(self, board: list, word: str) -> bool:\n        pass\n" },
  88:   { method: "merge",              params: ["intarray","int","intarray","int"], starter: "class Solution:\n    def merge(self, nums1: list, m: int, nums2: list, n: int) -> None:\n        pass\n" },
  98:   { method: "isValidBST",         params: ["tree"],                     starter: "# TreeNode is already defined for you\nclass Solution:\n    def isValidBST(self, root) -> bool:\n        pass\n" },
  101:  { method: "isSymmetric",        params: ["tree"],                     starter: "# TreeNode is already defined for you\nclass Solution:\n    def isSymmetric(self, root) -> bool:\n        pass\n" },
  102:  { method: "levelOrder",         params: ["tree"],                     starter: "# TreeNode is already defined for you\nclass Solution:\n    def levelOrder(self, root) -> list:\n        pass\n" },
  110:  { method: "isBalanced",         params: ["tree"],                     starter: "# TreeNode is already defined for you\nclass Solution:\n    def isBalanced(self, root) -> bool:\n        pass\n" },
  113:  { method: "pathSum",            params: ["tree","int"],               starter: "# TreeNode is already defined for you\nclass Solution:\n    def pathSum(self, root, targetSum: int) -> list:\n        pass\n" },
  124:  { method: "maxPathSum",         params: ["tree"],                     starter: "# TreeNode is already defined for you\nclass Solution:\n    def maxPathSum(self, root) -> int:\n        pass\n" },
  127:  { method: "ladderLength",       params: ["str","str","strarray"],     starter: "class Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: list) -> int:\n        pass\n" },
  129:  { method: "sumNumbers",         params: ["tree"],                     starter: "# TreeNode is already defined for you\nclass Solution:\n    def sumNumbers(self, root) -> int:\n        pass\n" },
  131:  { method: "partition",          params: ["str"],                      starter: "class Solution:\n    def partition(self, s: str) -> list:\n        pass\n" },
  142:  { method: "detectCycle",        params: ["linkedlist_cycle"],         starter: "# ListNode is already defined for you\nclass Solution:\n    def detectCycle(self, head):\n        pass\n" },
  143:  { method: "reorderList",        params: ["linkedlist"],               starter: "# ListNode is already defined for you\nclass Solution:\n    def reorderList(self, head) -> None:\n        pass\n" },
  153:  { method: "findMin",            params: ["intarray"],                 starter: "class Solution:\n    def findMin(self, nums: list) -> int:\n        pass\n" },
  155:  { method: "minstack",           params: ["design"],                   starter: "class MinStack:\n    def __init__(self):\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass\n" },
  160:  { method: "getIntersectionNode", params: ["intersect"],              starter: "# ListNode is already defined for you\nclass Solution:\n    def getIntersectionNode(self, headA, headB):\n        pass\n" },
  162:  { method: "findPeakElement",    params: ["intarray"],                 starter: "class Solution:\n    def findPeakElement(self, nums: list) -> int:\n        pass\n" },
  198:  { method: "rob",                params: ["intarray"],                 starter: "class Solution:\n    def rob(self, nums: list) -> int:\n        pass\n" },
  199:  { method: "rightSideView",      params: ["tree"],                     starter: "# TreeNode is already defined for you\nclass Solution:\n    def rightSideView(self, root) -> list:\n        pass\n" },
  200:  { method: "numIslands",         params: ["charmatrix"],               starter: "class Solution:\n    def numIslands(self, grid: list) -> int:\n        pass\n" },
  205:  { method: "isIsomorphic",       params: ["str","str"],                starter: "class Solution:\n    def isIsomorphic(self, s: str, t: str) -> bool:\n        pass\n" },
  206:  { method: "reverseList",        params: ["linkedlist"],               starter: "# ListNode is already defined for you\nclass Solution:\n    def reverseList(self, head):\n        pass\n" },
  207:  { method: "canFinish",          params: ["int","int2darray"],         starter: "class Solution:\n    def canFinish(self, numCourses: int, prerequisites: list) -> bool:\n        pass\n" },
  208:  { method: "trie",               params: ["design"],                   starter: "class Trie:\n    def __init__(self):\n        pass\n\n    def insert(self, word: str) -> None:\n        pass\n\n    def search(self, word: str) -> bool:\n        pass\n\n    def startsWith(self, prefix: str) -> bool:\n        pass\n" },
  215:  { method: "findKthLargest",     params: ["intarray","int"],           starter: "class Solution:\n    def findKthLargest(self, nums: list, k: int) -> int:\n        pass\n" },
  232:  { method: "myqueue",            params: ["design"],                   starter: "class MyQueue:\n    def __init__(self):\n        pass\n\n    def push(self, x: int) -> None:\n        pass\n\n    def pop(self) -> int:\n        pass\n\n    def peek(self) -> int:\n        pass\n\n    def empty(self) -> bool:\n        pass\n" },
  238:  { method: "productExceptSelf",  params: ["intarray"],                 starter: "class Solution:\n    def productExceptSelf(self, nums: list) -> list:\n        pass\n" },
  253:  { method: "minMeetingRooms",    params: ["int2darray"],               starter: "class Solution:\n    def minMeetingRooms(self, intervals: list) -> int:\n        pass\n" },
  256:  { method: "minCost",            params: ["int2darray"],               starter: "class Solution:\n    def minCost(self, costs: list) -> int:\n        pass\n" },
  268:  { method: "missingNumber",      params: ["intarray"],                 starter: "class Solution:\n    def missingNumber(self, nums: list) -> int:\n        pass\n" },
  289:  { method: "gameOfLife",         params: ["int2darray"],               starter: "class Solution:\n    def gameOfLife(self, board: list) -> None:\n        pass\n" },
  322:  { method: "coinChange",         params: ["intarray","int"],           starter: "class Solution:\n    def coinChange(self, coins: list, amount: int) -> int:\n        pass\n" },
  347:  { method: "topKFrequent",       params: ["intarray","int"],           starter: "class Solution:\n    def topKFrequent(self, nums: list, k: int) -> list:\n        pass\n" },
  409:  { method: "longestPalindrome",  params: ["str"],                      starter: "class Solution:\n    def longestPalindrome(self, s: str) -> int:\n        pass\n" },
  429:  { method: "levelOrder",         params: ["nary_tree"],                starter: "# Node is already defined for you\nclass Solution:\n    def levelOrder(self, root) -> list:\n        pass\n" },
  438:  { method: "findAnagrams",       params: ["str","str"],                starter: "class Solution:\n    def findAnagrams(self, s: str, p: str) -> list:\n        pass\n" },
  448:  { method: "findDisappearedNumbers", params: ["intarray"],            starter: "class Solution:\n    def findDisappearedNumbers(self, nums: list) -> list:\n        pass\n" },
  498:  { method: "findDiagonalOrder",  params: ["int2darray"],               starter: "class Solution:\n    def findDiagonalOrder(self, mat: list) -> list:\n        pass\n" },
  503:  { method: "nextGreaterElements", params: ["intarray"],                starter: "class Solution:\n    def nextGreaterElements(self, nums: list) -> list:\n        pass\n" },
  525:  { method: "findMaxLength",      params: ["intarray"],                 starter: "class Solution:\n    def findMaxLength(self, nums: list) -> int:\n        pass\n" },
  542:  { method: "updateMatrix",       params: ["int2darray"],               starter: "class Solution:\n    def updateMatrix(self, mat: list) -> list:\n        pass\n" },
  560:  { method: "subarraySum",        params: ["intarray","int"],           starter: "class Solution:\n    def subarraySum(self, nums: list, k: int) -> int:\n        pass\n" },
  690:  { method: "getImportance",      params: ["employeearray","int"],      starter: "# Employee: id, importance, subordinates\nclass Solution:\n    def getImportance(self, employees: list, id: int) -> int:\n        pass\n" },
  705:  { method: "myhashset",          params: ["design"],                   starter: "class MyHashSet:\n    def __init__(self):\n        pass\n\n    def add(self, key: int) -> None:\n        pass\n\n    def remove(self, key: int) -> None:\n        pass\n\n    def contains(self, key: int) -> bool:\n        pass\n" },
  706:  { method: "myhashmap",          params: ["design"],                   starter: "class MyHashMap:\n    def __init__(self):\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def remove(self, key: int) -> None:\n        pass\n" },
  733:  { method: "floodFill",          params: ["int2darray","int","int","int"], starter: "class Solution:\n    def floodFill(self, image: list, sr: int, sc: int, color: int) -> list:\n        pass\n" },
  739:  { method: "dailyTemperatures",  params: ["intarray"],                 starter: "class Solution:\n    def dailyTemperatures(self, temperatures: list) -> list:\n        pass\n" },
  740:  { method: "deleteAndEarn",      params: ["intarray"],                 starter: "class Solution:\n    def deleteAndEarn(self, nums: list) -> int:\n        pass\n" },
  863:  { method: "distanceK",          params: ["tree","int","int"],         starter: "# TreeNode is already defined for you\nclass Solution:\n    def distanceK(self, root, target: int, k: int) -> list:\n        pass\n" },
  931:  { method: "minFallingPathSum",  params: ["int2darray"],               starter: "class Solution:\n    def minFallingPathSum(self, matrix: list) -> int:\n        pass\n" },
  993:  { method: "isCousins",          params: ["tree","int","int"],         starter: "# TreeNode is already defined for you\nclass Solution:\n    def isCousins(self, root, x: int, y: int) -> bool:\n        pass\n" },
  994:  { method: "orangesRotting",     params: ["int2darray"],               starter: "class Solution:\n    def orangesRotting(self, grid: list) -> int:\n        pass\n" },
  997:  { method: "findJudge",          params: ["int","int2darray"],         starter: "class Solution:\n    def findJudge(self, n: int, trust: list) -> int:\n        pass\n" },
  1143: { method: "longestCommonSubsequence", params: ["str","str"],          starter: "class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        pass\n" },
  1192: { method: "criticalConnections", params: ["int","int2darray"],        starter: "class Solution:\n    def criticalConnections(self, n: int, connections: list) -> list:\n        pass\n" },
};

let updated = 0;
const result = data.map(lesson => ({
  ...lesson,
  problems: lesson.problems.map(p => {
    const meta = problemMeta[p.lcNumber];
    if (meta) {
      updated++;
      return { ...p, methodName: meta.method, paramTypes: meta.params, pythonStarter: meta.starter };
    }
    return p;
  })
}));

fs.writeFileSync(dataPath, JSON.stringify(result, null, 2));
console.log(`Added meta to ${updated} problems.`);
