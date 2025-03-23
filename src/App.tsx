import React, { useState } from 'react';
import { Brain, Clock, Box, AlertCircle, Code2 } from 'lucide-react';

type Language = 'javascript' | 'python' | 'java' | 'cpp';

type ComplexityResult = {
  time: string;
  space: string;
  explanation: string;
  algorithmType?: string;
};

function analyzeComplexity(code: string, language: Language): ComplexityResult {
  // Language-specific patterns
  const patterns = {
    javascript: {
      // Sorting Patterns
      mergeSort: /merge.*sort|sort.*merge/i,
      quickSort: /quick.*sort|partition|pivot/i,
      heapSort: /heap.*sort|heapify/i,
      bubbleSort: /bubble.*sort|swap.*next/i,
      insertionSort: /insertion.*sort|insert.*position/i,
      
      // Search Patterns
      binarySearch: /binary.*search|mid.*=.*\+.*\/.*2|middle.*=.*\+.*\/.*2/i,
      linearSearch: /linear.*search|sequential.*search/i,
      
      // Tree Patterns
      binaryTree: /class.*(?:Node|Tree)|left.*right|root\./i,
      bst: /binary.*search.*tree|bst|insert.*node/i,
      traversal: /(?:in|pre|post).*order|level.*order/i,
      
      // Dynamic Programming
      dp: /\[.*\].*=.*\[.*\]|memo.*=.*{}/i,
      fibonacci: /fib.*\(.*n.*\)/i,
      
      // General Patterns
      loop: /for|while|forEach|map|reduce/,
      nestedLoop: /for.*for|while.*while/s,
      recursion: /function.*\w+.*{.*\w+\(.*\).*}/s,
      divideConquer: /\w+\([^)]*,\s*\w+\s*,\s*\w+\s*\).*\w+\([^)]*,\s*\w+\s*,\s*\w+\s*\)/s,
      dataStructure: /Map\(|Set\(|{.*}|Object\./,
    },
    python: {
      mergeSort: /merge.*sort|sort.*merge/i,
      quickSort: /quick.*sort|partition|pivot/i,
      heapSort: /heap.*sort|heapify/i,
      bubbleSort: /bubble.*sort|swap.*next/i,
      insertionSort: /insertion.*sort|insert.*position/i,
      binarySearch: /binary.*search|mid.*=.*\+.*\/.*2|middle.*=.*\+.*\/.*2/i,
      linearSearch: /linear.*search|sequential.*search/i,
      binaryTree: /class.*(?:Node|Tree)|left.*right|root\./i,
      bst: /binary.*search.*tree|bst|insert.*node/i,
      traversal: /(?:in|pre|post).*order|level.*order/i,
      dp: /\[.*\].*=.*\[.*\]|memo.*=.*{}/i,
      fibonacci: /fib.*\(.*n.*\)/i,
      loop: /for|while|list comprehension/,
      nestedLoop: /for.*for|while.*while/s,
      recursion: /def.*\w+.*:.*\w+\(.*\)/s,
      divideConquer: /\w+\([^)]*,\s*\w+\s*,\s*\w+\s*\).*\w+\([^)]*,\s*\w+\s*,\s*\w+\s*\)/s,
      dataStructure: /dict\(|set\(|list\(|{.*}|\[.*\]/,
    },
    java: {
      mergeSort: /merge.*sort|sort.*merge/i,
      quickSort: /quick.*sort|partition|pivot/i,
      heapSort: /heap.*sort|heapify/i,
      bubbleSort: /bubble.*sort|swap.*next/i,
      insertionSort: /insertion.*sort|insert.*position/i,
      binarySearch: /binary.*search|mid.*=.*\+.*\/.*2|middle.*=.*\+.*\/.*2/i,
      linearSearch: /linear.*search|sequential.*search/i,
      binaryTree: /class.*(?:Node|Tree)|left.*right|root\./i,
      bst: /binary.*search.*tree|bst|insert.*node/i,
      traversal: /(?:in|pre|post).*order|level.*order/i,
      dp: /\[.*\].*=.*\[.*\]|memo.*=.*{}/i,
      fibonacci: /fib.*\(.*n.*\)/i,
      loop: /for|while|forEach|stream\(\)/,
      nestedLoop: /for.*for|while.*while/s,
      recursion: /\w+\s+\w+\s*\(.*\)\s*{.*\w+\(.*\).*}/s,
      divideConquer: /\w+\([^)]*,\s*\w+\s*,\s*\w+\s*\).*\w+\([^)]*,\s*\w+\s*,\s*\w+\s*\)/s,
      dataStructure: /HashMap|ArrayList|HashSet|new.*\(/,
    },
    cpp: {
      mergeSort: /merge.*sort|sort.*merge/i,
      quickSort: /quick.*sort|partition|pivot/i,
      heapSort: /heap.*sort|heapify/i,
      bubbleSort: /bubble.*sort|swap.*next/i,
      insertionSort: /insertion.*sort|insert.*position/i,
      binarySearch: /binary.*search|mid.*=.*\+.*\/.*2|middle.*=.*\+.*\/.*2/i,
      linearSearch: /linear.*search|sequential.*search/i,
      binaryTree: /class.*(?:Node|Tree)|left.*right|root\./i,
      bst: /binary.*search.*tree|bst|insert.*node/i,
      traversal: /(?:in|pre|post).*order|level.*order/i,
      dp: /\[.*\].*=.*\[.*\]|memo.*=.*{}/i,
      fibonacci: /fib.*\(.*n.*\)/i,
      loop: /for|while|foreach/,
      nestedLoop: /for.*for|while.*while/s,
      recursion: /\w+\s+\w+\s*\(.*\)\s*{.*\w+\(.*\).*}/s,
      divideConquer: /\w+\([^)]*,\s*\w+\s*,\s*\w+\s*\).*\w+\([^)]*,\s*\w+\s*,\s*\w+\s*\)/s,
      dataStructure: /vector|map|set|queue|stack/,
    },
  };

  const pattern = patterns[language];
  
  // Check for specific algorithm patterns
  const hasMergeSort = pattern.mergeSort.test(code);
  const hasQuickSort = pattern.quickSort.test(code);
  const hasHeapSort = pattern.heapSort.test(code);
  const hasBubbleSort = pattern.bubbleSort.test(code);
  const hasInsertionSort = pattern.insertionSort.test(code);
  const hasBinarySearch = pattern.binarySearch.test(code);
  const hasLinearSearch = pattern.linearSearch.test(code);
  const hasBinaryTree = pattern.binaryTree.test(code);
  const hasBST = pattern.bst.test(code);
  const hasTraversal = pattern.traversal.test(code);
  const hasDP = pattern.dp.test(code);
  const hasFibonacci = pattern.fibonacci.test(code);
  
  // General patterns
  const hasLoop = pattern.loop.test(code);
  const hasNestedLoops = pattern.nestedLoop.test(code);
  const hasRecursion = pattern.recursion.test(code);
  const hasDivideConquer = pattern.divideConquer.test(code);
  const hasDataStructure = pattern.dataStructure.test(code);

  let timeComplexity = "O(1)";
  let spaceComplexity = "O(1)";
  let explanation = "Constant time and space complexity.";
  let algorithmType = "Basic Operation";

  // Sorting Algorithms
  if (hasMergeSort || (hasRecursion && hasDivideConquer)) {
    timeComplexity = "O(n log n)";
    spaceComplexity = "O(n)";
    explanation = "Divide-and-conquer sorting algorithm with logarithmic recursion tree and linear space for merging.";
    algorithmType = "Merge Sort";
  } else if (hasQuickSort) {
    timeComplexity = "O(n log n)";
    spaceComplexity = "O(log n)";
    explanation = "Divide-and-conquer sorting algorithm with average case O(n log n), worst case O(n²).";
    algorithmType = "Quick Sort";
  } else if (hasHeapSort) {
    timeComplexity = "O(n log n)";
    spaceComplexity = "O(1)";
    explanation = "Comparison-based sorting using a binary heap data structure.";
    algorithmType = "Heap Sort";
  } else if (hasBubbleSort || hasInsertionSort) {
    timeComplexity = "O(n²)";
    spaceComplexity = "O(1)";
    explanation = "Simple comparison-based sorting with quadratic time complexity.";
    algorithmType = hasBubbleSort ? "Bubble Sort" : "Insertion Sort";
  }

  // Search Algorithms
  else if (hasBinarySearch) {
    timeComplexity = "O(log n)";
    spaceComplexity = "O(1)";
    explanation = "Binary search algorithm with logarithmic time complexity.";
    algorithmType = "Binary Search";
  } else if (hasLinearSearch) {
    timeComplexity = "O(n)";
    spaceComplexity = "O(1)";
    explanation = "Linear search with sequential access pattern.";
    algorithmType = "Linear Search";
  }

  // Tree Operations
  else if (hasBinaryTree || hasBST) {
    if (hasTraversal) {
      timeComplexity = "O(n)";
      spaceComplexity = "O(h)";
      explanation = "Tree traversal visiting all nodes, where h is the height of the tree.";
      algorithmType = "Tree Traversal";
    } else {
      timeComplexity = "O(h)";
      spaceComplexity = "O(1)";
      explanation = "Binary tree/BST operation, where h is the height of the tree.";
      algorithmType = hasBST ? "Binary Search Tree" : "Binary Tree";
    }
  }

  // Dynamic Programming
  else if (hasDP || hasFibonacci) {
    timeComplexity = "O(n)";
    spaceComplexity = "O(n)";
    explanation = "Dynamic programming solution with memoization/tabulation.";
    algorithmType = "Dynamic Programming";
  }

  // General Cases
  else if (hasNestedLoops) {
    timeComplexity = "O(n²)";
    explanation = "Quadratic time complexity due to nested loops.";
  } else if (hasLoop) {
    timeComplexity = "O(n)";
    explanation = "Linear time complexity due to single loop.";
  } else if (hasRecursion && !hasDivideConquer) {
    timeComplexity = "O(2ⁿ)";
    spaceComplexity = "O(n)";
    explanation = "Exponential time complexity with recursive calls.";
  }

  if (hasDataStructure && spaceComplexity === "O(1)") {
    spaceComplexity = "O(n)";
    explanation += " Additional space needed for data structures.";
  }

  return { time: timeComplexity, space: spaceComplexity, explanation, algorithmType };
}

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('java');
  const [result, setResult] = useState<ComplexityResult | null>(null);

  const handleAnalyze = () => {
    if (!code.trim()) return;
    setResult(analyzeComplexity(code, language));
  };

  const getPlaceholder = () => {
    const examples = {
      javascript: `// Example sorting algorithms:
function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

// Or try binary search:
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      python: `# Example dynamic programming:
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]

# Or try tree traversal:
class Node:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def inorderTraversal(root):
    if not root:
        return []
    return inorderTraversal(root.left) + [root.val] + inorderTraversal(root.right)`,
      java: `// Example heap sort:
void heapSort(int arr[]) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n-1; i >= 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}

// Or try BST insertion:
class Node {
    int key;
    Node left, right;
    public Node(int item) {
        key = item;
        left = right = null;
    }
}`,
      cpp: `// Example quick sort:
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// Or try dynamic programming:
int fibonacci(int n) {
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for(int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}`,
    };
    return examples[language];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Algorithm Complexity Analyzer</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Code2 className="w-5 h-5 text-blue-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full h-96 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAnalyze}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Analyze Complexity
          </button>
        </div>

        {result && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">Time Complexity</h3>
                </div>
                <p className="text-2xl font-mono text-blue-400">{result.time}</p>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Box className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold">Space Complexity</h3>
                </div>
                <p className="text-2xl font-mono text-green-400">{result.space}</p>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold">Algorithm Type</h3>
              </div>
              <p className="text-xl font-mono text-purple-400">{result.algorithmType}</p>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold">Explanation</h3>
              </div>
              <p className="text-gray-300">{result.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;