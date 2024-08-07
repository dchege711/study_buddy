import { CreateCardParams } from "../models/CardsMongoDB";

type SampleCard =
  & Omit<CreateCardParams, "createdById" | "isPublic">
  & Partial<Pick<CreateCardParams, "createdById" | "isPublic">>;

export const sampleCards: SampleCard[] = [
  {
    "title": "The Star (Arthur Clarke)",
    "description":
      "* A people perished to pave way for the star of Bethlehem. The people knew their star would fail, and the end was nigh.",
    "tags": "miscellaneous fiction arthur_clarke book_excerpts",
    "urgency": 1,
    "parent": "",
  },

  {
    "title": "Minimum and Maximum in ~3n/2 Comparisons",
    "description": "",
    "tags": "sorting searching algorithms",
    "urgency": 5.1,
    "parent": "",
  },

  {
    "title": "Test",
    "description": "Gif card.\n\n\\(4\\)\n",
    "tags": "t medium_programming_challenges",
    "urgency": 5.08,
    "parent": "",
  },

  {
    "title": "Usefulness of Graphs",
    "description":
      "Graphs are useful for finite # of states and well-defined transitions, e.g. word puzzles",
    "tags": "algorithms graph_theory",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "C89 Booleans, Switches and If Statements",
    "description":
      "* C89 lacks booleans. \n* 0 is false, everything else is true. \n* Also, in switch statements, if you forget the break at the end of each case, the rest of the code in the remaining cases will be evaluated. \n* The switch statement is faster than nested if-else statements.",
    "tags": "c programming cos217",
    "urgency": 1,
    "parent": "",
  },

  {
    "title": "Elementary Speed Control",
    "description":
      "Since not all components have constant impedance, adjusting V for control is inadequate. The DC motor can be modeled as an RL circuit. The back emf produced as it turns ensures that the motor effectively uses only a small portion of the battery's voltage.",
    "tags": "ele302 hardware",
    "urgency": 1,
    "parent": "",
  },

  {
    "title": "Bijections",
    "description":
      "Bijections allow us to conclude that |A| = |B|. Sometimes calculating |B| is easier than calculating |A|. If we get good at counting sequences, we can use bijections to count/reason about related sets.",
    "tags": "cos340 mathematics",
    "urgency": 1,
    "parent": "",
  },

  {
    "title": "The Sieve of Eratosthenes",
    "description":
      "The Sieve of Eratosthenes, \\(O(N\\ log\\ log\\ N)\\) time and \\(O(N)\\) space, is an efficient way of generating primes up to N.\n\n* Initialize an empty array with \\(N+1\\) elements.\n* Cross off element \\(0\\) and element \\(1\\) as `false`\n* Cross off subsequent multiples of \\(2, 3, 5, ... \\sqrt{N}\\)\n\nBut if we know the maximum prime number beforehand, it makes more sense to create a hash-table of primes. There are [lists are available](https://primes.utm.edu/).",
    "tags": "algorithms mathematics primes",
    "urgency": 3.6,
    "parent": "",
  },

  {
    "title": "Bayesian Ranking",
    "description":
      "Use Bayesian ranking when rating families of items. Remember, an independent and unbiased crowd gives an error that is 1/N times the error from individual guesses.",
    "tags": "networks",
    "urgency": 2,
    "parent": "",
  },

  {
    "title": "Different Types of Noise",
    "description":
      "SNR defines signal quality. White noise (although fundamental due to thermal energy) averages out better than flicker noise does. It dominates at high frequencies.",
    "tags": "ele301 hardware",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Geek Heresy: Role of Ed-Tech",
    "description":
      "Children need caring, knowledgeable, adult attention more than ed-tech. Technology amplifies, but seldom creates, behavior.",
    "tags": "miscellaneous book_excerpts geek_heresy",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "The Last Invention of Man",
    "description":
      "A political agenda centered around seven slogans: democracy, tax cuts, government social service cuts, military spending cuts, free trade, open borders and socially responsible companies.\n\n[The Last Invention of Man](http://nautil.us/issue/53/monsters/the-last-invention-of-man)",
    "tags": "miscellaneous articles tech ai c13u_diaries",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "C90 Pointers",
    "description":
      "```\nint i = 1;\nint *p; /* Means p is a pointer that points to ints */\np = &i; /* p now points to i */\n*p; /* This is an alias for i, the actual value */\n```\n\n* When given pointers as arguments, utilize the storage that has already been allocated for you.\n* If returning a pointer, don't return one that points to a variable that was defined within the function since it will be cleared from the stack.\n",
    "tags": "cos217 programming pointers",
    "urgency": 2,
    "parent": "",
  },

  {
    "title": "Implications and Tautologies",
    "description":
      "Propositions can be either true or false. \n\n* `P => Q` is true when P is false or Q is true\n* `P <=> Q` is true provided P and Q are either both true or both false\n\nA set of axioms is necessarily incomplete. \n\n`(X == Y) <=> (~Y == ~X)` is a tautology, but can be convenient.",
    "tags": "mathematics cos340",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "The Passion of the Monk",
    "description":
      "Thomas realized that following your passion is frighteningly naive - becoming a full-time Zen practitioner didn't magically make his life wonderful. How do people end up happy at what they're doing? You need to be good at something before you expect a good job. You'll also need to invest in career capital.",
    "tags": "books so_good_they_cannot_ignore_you cal_newport",
    "urgency": 2,
    "parent": "",
  },

  {
    "title": "Conditional Probability",
    "description":
      "* How would you interpret conditional probability using a probability tree?\n* Derive Bayes' Rule from conditional probability.\n\n\n\n[spoiler]\n# Conditional Probability\n* \\(\\mathbb{P}\\{B|A\\}\\) assumes that \\(A\\) has definitely happened.\n* In the tree framework, think, now that we're certainly at \\(A\\), what's the probability of going to \\(B\\) ?\n\n# Deriving Bayes' Rule\n\n* From Conditional Probability, we get : \\( \\mathbb{P}\\{A | B\\} = \\frac{\\mathbb{P}\\{A \\cap B\\}} {\\mathbb{P}\\{B\\}}\\) and \\( \\mathbb{P}\\{B | A\\} = \\frac{\\mathbb{P}\\{A \\cap B\\}} {\\mathbb{P}\\{A\\}}\\)\n\n* Merging the 2 gives Bayes' Formula: \\( \\mathbb{P}\\{A | B\\} = \\frac{ \\mathbb{P}\\{B | A\\} \\times \\mathbb{P}\\{A\\} } {\\mathbb{P}\\{B\\} } \\)\n\n",
    "tags": "probability cos340 mathematics",
    "urgency": 6.39,
    "parent": "",
  },

  {
    "title": "Generalized Product Rule for Probability",
    "description":
      "* What is the generalized product rule?\n\n* How does a tree encode it?\n\n\n\n[spoiler]\n\n* The tree diagram encodes the product rule, i.e. \\(\\mathbb{P}\\{A_1 \\cap A_2\\} = \\mathbb{P}\\{A_1\\} \\times \\mathbb{P}\\{A_2 | A_1\\} \\) = products of edge probabilities from \\(A_1\\)'s parent (might be root) to \\(A_1\\) and then to \\(A_2\\).\n\n* Similarly, \\(\\mathbb{P}\\{A_1 \\cap ... \\cap A_n\\} = \\mathbb{P}\\{A_1\\} \\times \\mathbb{P}\\{A_2|A_1\\} \\times \\mathbb{P}\\{A_3| A_1 \\cap A_2\\} \\times ... \\times \\mathbb{P}\\{A_n | A_1 \\cap ... \\cap A_{n-1}\\}\\)\n\n* On the tree, we're looking at the product of the edge probabilities along the path from \\(A_1\\)'s parent, to \\(A_1\\), to \\(A_2\\), all the way to \\(A_n\\).\n",
    "tags": "mathematics cos340 probability",
    "urgency": 5.36,
    "parent": "",
  },

  {
    "title": "Sum Rule, Product Rule & Subsets",
    "description":
      "> Sum Rule: If \\(A_1, ... , A_n\\) are disjoint, what is the size of their union?\n> Product Rule: What is the size of \\(|A_1 \\times A_2 \\times ... \\times A_n|\\)?\n> How many subsets are there in an \\(n\\)-element set?\n\n\n[spoiler]\n\nThe Sum Rule: If \\(A_1, ... , A_n\\) are disjoint, the size of their union is \\(|A_1| + ... + |A_n|\\).\n\nThe Product Rule: \\(|A_1 \\times A_2 \\times ... \\times A_n| = |A_1| \\times |A_2| \\times ... \\times |A_n|\\)\n\nDisjointedness is not needed. The product of sets shows all possible subsets if we must pick exactly one element from each set.\n\nThe # of subsets of an n-element set is \\(2^n\\). Each element can either be chosen, or not be chosen, hence \\(2^n\\)",
    "tags": "cos340 mathematics cs_theory",
    "urgency": 3.35,
    "parent": "",
  },

  {
    "title": "Second Dawn (Arthur C. Clarke)",
    "description":
      "* The wonderfully sensitive hands of the Phileni had enabled them to find by experiment and trial facts which had taken the planet's only other intelligent species a thousand times as long to discover by pure deduction.\n* The Phileni knew, for example, that a triangle with sides in the ratio 3-4-5 was right-angled, but had not suspected that this was only a special case of a much more general law.\n* Your task won't be a simple one... At first you must be content to sow the seed, to arouse interest and curiosity - particularly among the young, who will come here and learn more.",
    "tags": "fiction education books arthur_clarke book_excerpts c13u_diaries",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Education as Advanced Signaling",
    "description":
      "* That an educated person gets a better job doesn't imply that if everyone got educated, everyone would get better jobs.\n* The wrong magician for the right trick: how are educators supposed to prepare students for countless jobs that they know nothing about?\n* Statistical discrimination is real. Employers have hard times seeing diamonds in the rough.\n* Riddle me this: a Princeton education w/o the diploma, or a Princeton diploma w/o its education. Choose one.",
    "tags": "education the_case_against_education books c13u_diaries",
    "urgency": 2,
    "parent": "",
  },

  {
    "title": "Graph Theory 101",
    "description":
      "* Terms that I should be able to define: *degree vs indegree and outdegree, subgraph, multigraph vs. simple graph, path, cycle and isomorphism*\n\n#### Mini-exercises\n\n* Counting the same thing in different ways is useful in disproving a claim. How would you challenge the claim: *\"On average, men have 74% more opposite-gender partners than women\"*?",
    "tags": "cos340 graph_theory",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Upper Bound on Graph Diameter",
    "description":
      "* Graph diameter: the distance between the two vertices that are farthest apart.\n\n* Theorem: *Let `v` be an arbitrary vertex in a graph G. If every vertex is within distance `d` of `v`, then the diameter of the graph is at most `2d`.*\n\n* Such bounds help us reason with incomplete data.\n",
    "tags": "cos340 graph_theory",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Spanning Trees",
    "description":
      "* Theorem: *Every connected graph \\\\(G = (V, E)\\\\) contains a spanning tree \\\\(T = (V, E')\\\\) as a sub-graph. (proof by contradiction)*\n\n* Barovka's Theorem: *For all cuts in \\\\(G\\\\), the crossing edge of minimum weight is in the MST* (proof by contradiction)",
    "tags": "cos340 graph_theory",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "Advice on Starting a Web App",
    "description":
      "* Pick a fight and under-do your competition.\n* Half a product is better than a half-assed product.\n* Team efficiency grows with \\(sqrt(N)\\)\n* Make sure it works. Ignore details and imaginary problems.\n* You should take sides. Can't please everybody.\n* New features are like babies - think about diapers, tuition, and bills before getting one.",
    "tags": "books getting_real entrepreneurship",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Capsule Networks",
    "description":
      "Operating Principle: *Active capsules at one level make predictions for the instantiation parameters of higher-level capsules. When multiple predictions agree, a higher level capsule becomes active*.",
    "tags": "orf401 neural_networks",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Cache Boosts",
    "description":
      "Here are sample problems whose solutions benefit from caching previous results:\n\n* What is the LCM of numbers from \\\\(1\\\\) to \\\\(N ?\\\\)\n",
    "tags": "algorithms caching programming_challenges",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "Runtime of Sorting Algorithms",
    "description":
      "> What is the run time and space complexity of selection sort, quick sort, merge sort?\n\n\n[spoiler]\nQuicksort - \\(O(NlgN\\) time, \\(O(N)\\) space.\n....\n",
    "tags": "sorting algorithms",
    "urgency": 10,
    "parent": "",
  },

  {
    "title": "Minimum Coin Change",
    "description":
      "> You are given coins of different denominations and a total amount of money amount. Return the fewest number of coins that you need to make up that amount. If it's impossible, return -1\n\n\n\n* Try it on [LeetCode](https://leetcode.com/problems/coin-change/description/)\n\n\n[spoiler]\n```python\ndef dp_min_coin_change(self, target, denominations):\n    min_coins_needed = [inf] * (target + 1)\n    min_coins_needed[0] = 0\n    for coin in denominations:\n        for amount in range(coin, target+1):\n            min_coins_needed[amount] = min(min_coins_needed[amount], 1 + min_coins_needed[amount - coin])\n    if min_coins_needed[target] == inf: return -1\n    return min_coins_needed[target]\n\n```\n",
    "tags": "dynamic_programming medium_programming_challenges",
    "urgency": 7.06,
    "parent": "",
  },

  {
    "title": "C89 Increments & Null Statements",
    "description":
      "* `i++` => fetch current i then increment i. \n* `++i` => increment i then fetch this new value. \n\n`goto` statements are like wormholes in your code. But such antics lead to spaghetti code. Use logical structuring instead of jumping all over the place.\n\nBe wary of the null statements, e.g. `while (i < 5);` \nThey can cause an infinite loops or lead to unused conditional tests.",
    "tags": "cos217 programming c",
    "urgency": 2,
    "parent": "",
  },

  {
    "title": "1984 Manipulating Public Sentiment",
    "description":
      "A hideous ecstasy of fear and vindictiveness, a desire to kill...seemed to flow through the whole group of people like an electric current, turning one even against one's will into a grimacing, screaming lunatic. And yet the rage that one felt was an abstract, undirected emotion which could be switched from one object to another like the flame of a blowlamp.",
    "tags": "miscellaneous 1984 book_excerpts c13u_diaries",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Arguing About the Tails: Chernoff Bounds",
    "description":
      "* What do Chernoff Bounds tell us? How do these bounds compare to Markov's Inequality?\n\n\n\n[spoiler]\n\nIf we have mutually independent events, and let X be the number of those events that occur, then: \n$$ \\mathbb{P}\\{X \\le (1-\\delta) \\cdot \\\n\\mathbb{E}[X] \\} \\le e^{- (\\delta^2) \\cdot \\mathbb{E}[X] / 2 }\\ when\\ 0 \\le \\delta \\le 1 $$ \n$$ \\mathbb{P}\\{X \\ge (1+\\delta) \\cdot \\mathbb{E}[X] \\} \\le e^{- (\\delta^2) \\cdot \\mathbb{E}[X] / 3 }\\ when\\ 0 \\le \\delta \\le 1 $$ \n$$ \\mathbb{P}\\{X \\ge c \\cdot \\mathbb{E}[X] \\} \\le e^{-(c \\cdot ln(c) - c + 1) \\cdot \\mathbb{E}[X] } \\ when\\ c \\ge 1 $$\n\nIntuitively, Chernoff Bounds tell us that the tail is quite small. We're way more likely to be near \\(\\mathbb{E}[X]\\)\nChernoff Bounds are Markov's Inequality on Steroids because we now know that the events are mutually independent.\n",
    "tags": "cos340 mathematics probability",
    "urgency": 5.85,
    "parent": "",
  },

  {
    "title": "Hashing and Collisions",
    "description":
      "* Suppose we have \\(R\\) balls and \\(N\\) bins. How many balls are typically needed in order to have a collision?\n* Suppose we have \\(N\\) balls and \\(N\\) bins. Let \\(X\\) be the number of balls in bin B. Set some bounds on \\(X\\)\n\n[spoiler]\nThe case of \\(R\\) balls and \\(N\\) bins...\n* By The Pigeonhole Principle, we're sure of a collision once \\(R > N\\)\n* The Birthday Principle says there's an even chance that some bin contains 2 balls when \\(R \\approx \\sqrt{2 \\cdot ln(2) \\cdot N}\\)\n\nThe case of \\(N\\) balls and \\(N\\) bins...\n* Murphy's Law tells us that \\(\\mathbb{P}\\{X \\ge 1\\} \\ge 1 - e^{-1}\\)\n* We can use Chernoff Bounds to conclude that \\(\\mathbb{P}\\{X \\ge c\\} < e ^{c \\cdot ln(c) - c + 1}\\)\n* How high can we set \\(c\\) without too much penalty? When \\(c = \\frac{e \\cdot ln(N)}{ ln ln N}\\), we observe that \\(\\mathbb{P}\\{X \\ge c\\} < \\frac{1}{ N^2} \\)\n",
    "tags": "probability cs_theory cos340",
    "urgency": 5,
    "parent": "",
  },

  {
    "title": "Converting Normal to Standard Normal",
    "description":
      "> How do you convert a normal distribution to the standard normal distribution? What is the purpose of doing so?\n\n\n\n[spoiler]\n\n* Say \\(X \\approx N(\\mu, \\sigma^2)\\). Getting \\(\\mathbb{P}\\{X > a\\}\\) will involve some nasty integrals. \n\n* We can however use the already studied values for \\(N(0, 1)\\) for a quicker answer.\n\n* First find \\(d\\), number of standard deviations that \\(a\\) is away from the mean, i.e. \\(d = \\frac{|a - \\mu|}{\\sigma}\\)\n\n* Then look up the corresponding value for \\(\\mathbb{P}\\{N(0, 1)\\} > d\\)\n",
    "tags": "mathematics cos340 probability orf309",
    "urgency": 3.47,
    "parent": "",
  },

  {
    "title": "Simple Connectivity Theorem",
    "description":
      "> When proving statements about graphs, what's the general technique?\n> Prove the simple connectivity theorem for graphs.\n\n\n[spoiler]\n\n* *Every graph `G = (V, E)` has at least `|V| - |E|` connected components.*\n* The proof uses induction on the number of edges.\n* A corollary is that *every connected graph with `n` vertices has at least `(n-1)` edges.\n\n#### Tips on Proofs About Graphs\n* Always try inducting on the number of edges, or the number of vertices before trying out any other variable.\n* To prove `(n+1)` holds, try to use shrink-down and grow-back arguments to avoid logical errors.",
    "tags": "graph_theory cos340",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "Properties of Trees",
    "description":
      "> What 5 properties does every tree \\(T = (V, E)\\) have?\n\n[spoiler]\n* There's a unique path between every pair of vertices. *(proof by contradiction)*\n* Adding any edge creates a cycle. *(argument from unique path for all \\((u, v)\\)*\n* Removing any edge disconnects the graph. *(argument from unique path for all \\((u, v)\\)*\n* Every tree with at least two vertices has at least two leaves. *(finite graph, no retracing edges)*\n* \\(|V| = |E| + 1\\) *(induction on \\(|V|\\))*\n\nThe 5 properties can bear more, e.g. *a connected graph that satisfies \\(|V| = |E| + 1\\) is necessarily a tree*",
    "tags": "cos340 graph_theory",
    "urgency": 5,
    "parent": "",
  },

  {
    "title": "Solving Recurrences Using Guess-and-Verify",
    "description":
      "> The recursive solution for Towers of Hanoi is \\(T_n = 2T_{n-1} + 1\\) with \\(T_1 = 1\\) as the base case. Get the closed form using 'guess and verify'.\n\n> What are the advantages and disadvantages of this approach?\n\n[spoiler]\n\n\n1. Tabulate small values of \\(T_n\\), e.g. \\( T_2 = 3, T_3 = 7, T_4 = 15 \\)\n\n\n2. Guess a solution, e.g. \\(T_n = 2^n - 1\\)\n\n\n3. Verify the guessed solution using a proof (usually induction)\n\nNote: Guess-and-Verify requires more intuition, but is less error prone than the Plug-and-Chug method.",
    "tags": "cos340 mathematics cs_theory",
    "urgency": 4.59,
    "parent": "",
  },

  {
    "title": "Solving Recurrences Using the Plug-and-Chug Method",
    "description":
      "> The recursive definition for the Towers of Hanoi problem is \\(T_n = 2T_{n-1} - 1\\) with \\(T_1 = 1 \\). Use the plug-and-chug method to solve the recurrence.\n\n\n[spoiler]\n\nAlternate between applying the recurrence relation and simplifying the resulting expression.  \n\n\n\n\\(T_n = 1 + 2T_{n-1} = 1 + 2(1 + 2T_{n-2}) \\)\n\\( = 1 + 2 + 4T_{n-2} = 1 + 2 + 4(1 + 2T_{n-3}) \\)\n\\( = 1 + 2 + 4 + 8T_{n-3} = 1 + 2 + 4 + 8(1 + 2T_{n-4}) \\) \n\nTry to identify a pattern in the chug steps (it helps if you chugged in moderation):  \n\n\\( 1 + 2 + 4 + . . . + 2^{i−1} + 2^i \\cdot T_{n−1} \\)\n\nDo one last round of plugging and chugging to verify that the pattern is reasonable:  \n\n\\( T_n = 1 + 2 + 4 + 8 + 16T_{n-4} \\)\n\nSubstitute a convenient value of \\(i\\) such that only the base cases of \\(T\\) are left. Simplify the expression. For instance, \\(i = n-1\\) works for us.  \n\n\\( T_n = 1 + 2 + 4 + ... + 2^{n-2} + 2^{n-1}T_1 \\)\n\\( T_n = 1 + 2 + 4 + ... + 2^{n-2} + 2^{n-1} \\) \n\nFind a closed form for the expression.  \n\n\\( T_n = \\sum_{i=0}^{n-1}2^i = 2^n - 1 \\)\n",
    "tags": "cos340 mathematics",
    "urgency": 3.82,
    "parent": "",
  },

  {
    "title": "Mostly Lost",
    "description":
      "* Jargons feed on attention. If they can't get that, they'll settle for fear and intimidation.\n* That's how it starts. A little Jargon doesn't look like much. Some people even keep them as pets. But they form packs, and they are very dangerous.\n* That's right! You're guaranteed to get home eventually; it's only logical. Along the way I've seen the sunrise over the Towers of Hanoi and climbed the Upper Bounds. I've sat down at the Lookup Table and floated on the Overflow River. It's a good life. Being lost can be fun!\n* Mostly lost is fun, but completely lost is serious... Now you know where you are and where you are going! You are only mostly lost.",
    "tags": "books lauren_ipsum book_excerpts fiction",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Eponymous Bach from 'Sense and Sensibleness'",
    "description":
      "* If I can't help solve your problem, I can at least give it a name. Do come in and have some tea.\n* I used to put my name on Things. But it's much better to have your name on an Idea... Nobody uses Andy's Magical Wire Bender anymore, but Ampere's Law will always be current.\n* Names are very important! A thing without a name is like a pot without a handle. Just try telling a story about turtles without using the word *turtle*\n* Many things make sense but are not sensible at all... You can also walk around the outside of the house, or even all the way around the planet, to go from the front door to the back door.",
    "tags": "books lauren_ipsum book_excerpts",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Lauren Ipsum Mash-Up",
    "description":
      "* She says Steganosauruses don’t exist because she’s never seen one. But that proves my point! Steganosauruses are so good at hiding that people think they’re imaginary.\n* Achilles the Logician: *\"Experiment is always better than mere Theory. And an impartial judge sounds wonderful, especially when she already agrees with me!\"*\n* Xor: *\"Time flies like an arrow, and fruit flies like a banana. Let's see if there's a fruit fly problem I can help them solve.\"*\n* Tinker: *\"I deal only in Exact answers. But there is a brilliant Composer who lives in Permute, named Hugh Rustic. He deals in Good Enough answers. I send him all of my hardest cases. I'll write an IOU that you can take to him.\"*",
    "tags": "books lauren_ipsum book_excerpts fiction",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Lauren Ipsum: Heuristics",
    "description":
      "* Kings always want something silly, like a book about everything, or a chariot with no weak parts. This king decided that he wanted a perfect map that was as large as his kingdom.\n* If it's improbable, how do you do it? *By shifting your point of view. Instead of looking for an answer that fits your problem, you can imagine your answer and look for a problem to fit it. To find the best tomato in the market, you'd have to look at each and every tomato. But no one does that! There are plenty of tomatoes that are good enough!*\n* When an ant finds food, she leaves a little scent message for the others that come after her. Lots of ants can try different paths at the same time, Eventually, they'll settle on a quick route to all of the food and back to their nest.",
    "tags": "fiction lauren_ipsum books book_excerpts",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Lauren Ipsum: A Fair Exchange & Cleverness When It Counts",
    "description":
      "* It's possible to get absolutely fair flips out of even the most unfair coin. Flip it twice. If you get H-T, use H as your answer. If you get T-H, use T as your answer. Otherwise, start over. \n\n* No matter how unfair the coin is, the odds of getting H then T will always be exactly the same as getting T then H.\n\n* Zero is even! It evenly divides by two. But zero plus zero is zero. Odd + Odd = Even. So if zero is even like you insist, then it must also be odd at the same time. You see, miss, when it comes to important questions, where you stand depends on where you sit.\n\n* The Broccoli Situation: *Take the goat over to the other side. Come back empty. Take the wolf over but then bring back the goat. Leave the goat and take the mandelbroccoli over. Come back empty. Finally, take the goat over again.*\n",
    "tags": "books lauren_ipsum book_excerpts fiction c13u_diaries",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Benefits of Virtual Memory",
    "description":
      "* Context switching: only save the contents of registers and a pointer to the process's page table.\n* Memory protection: page tables only contain physical memory pages that the process uses and nothing else.\n* Permission bits in page-table entries allow memory protection within processes, e.g. *CPU prohibits writing to RODATA and TEXT sections*\n* Data sharing, e.g. single copy of stdio library code is mapped to the virtual address space of each process.\n* In dynamic memory allocation, the OS allocates *contiguous* virtual memory pages... and scatters them anywhere in physical memory.\n* Upon `fork()` the OS creates virtual pages for the child, and only duplicates physical pages when a 'write' occurs.\n* Upon `execvp()`, the OS changes process's virtual page table to point to pages on disk containing the new program. As page faults occur, OS swaps pages of new program into memory incrementally as needed.\n",
    "tags": "cos217 c os",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Lauren Ipsum: Lighthouses",
    "description":
      "* Obviously, the problem isn't shape or size - the problem is that they are *hollow inside*! ... In fact, we're going to build a pyramid. A pyramid can't fall down. It's already fallen down.\"\n* I start with big ideas and make them smaller. *[Make them smaller? Why?]* Why not? Only people with small minds think Big Problems need Big Ideas.\n* How would you talk about a lighthouse without using the word lighthouse? *[A tall white tower near the sea with a room full of windows at the top, and a big light on top of that, and a long twisty staircase inside]* Now look at each part and see if it's essential.",
    "tags": "book_excerpts lauren_ipsum fiction books",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Airlines",
    "description":
      "**Airline Themes**\n* Consolidation because of high costs and inflexible labor.\n* High fuel costs caused consolidation, ancillary charges & few to no startups.\n* Low Cost Carriers are gaining traction. Estimated to triple.\n* Ancillary revenues, e.g. on-board meals, have increased at the cost of consumer expectation mismanagement.\n* Regulations have been increasing, *e.g. tarmac rule, full fare rule*. Trump's admin might roll those back.\n\n**Changes in Airline Competition**\n* More yield management (probably price-discriminating strategies).\n* JetBlue, Alaska, Virgin & Hawaii are stuck between ULCCs and the Big 4.\n* Rush for Gate real estate by the big carriers keeps fares high and competition low.\n",
    "tags": "orf401 business",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Bijections, Surjections and Injections for Finite Sets",
    "description":
      "* What do surjective, injective and bijective mappings mean?\n* If we have two finite sets, \\(A, B\\) when is \\(|A| \\ge |B|\\), \\(|A| \\le |B|\\), \\(|A| == |B|\\), \\(|A| > |B|\\)?\n\n[spoiler]\n\nThe following properties hold for finite sets, but don't blindly assume them for infinite sets:\n\n* \\( |A| \\ge |B| \\) if and only if there is a surjection from \\(A\\) to \\(B\\)\n* \\( |A| \\le |B| \\) if and only if there is an injection from \\(A\\) to \\(B\\)\n* \\( |A| = |B| \\) if and only if there is a bijection between \\(A\\) and \\(B\\)\n* \\( |A| > |B| \\) if and only if there is a surjection from \\(A\\) to \\(B\\), but there is no bijection from \\(B\\) to \\(A\\)\n\nDefinition: The mapping \\(X \\rightarrow Y\\) is:\n\n* Surjective if every \\(y\\) is mapped to at least once.\n* Injective if every \\(y\\) is mapped to at most once.\n* Bijective is every \\(y\\) is mapped to exactly once.\n\n\n",
    "tags": "cos340 set_theory mathematics",
    "urgency": 5.03,
    "parent": "",
  },

  {
    "title": "Injections, Surjections and Bijections for Infinite Sets",
    "description":
      "> Which properties carry over from finite sets to infinite sets?\n> Which properties no longer hold when comparing infinite sets?\n\n\n\n[spoiler]\n\n* Some properties carry over from finite sets into infinite sets:\n\n\\( |A| >= |B| \\land\\ |B| >= C \\implies |A| \\ge |C| \\)\n\n\\( |A| = |B| \\land |B| = |C| \\implies |A| = |C| \\)\n\n\\( |A| = |B| \\implies |B| = |A| \\)\n\n* Schröder-Bernstein Theorem: \\(|A| \\ge |B| \\land |B| \\ge |A| \\implies |A| = |B|\\)\n\n* But some properties of finite sets don't carry over to infinite sets. If \\(A\\) is infinite, then for a finite set \\(B\\), \\(| A \\cup B| = |A| \\)\n\n",
    "tags": "cos340 set_theory mathematics",
    "urgency": 4.36,
    "parent": "",
  },

  {
    "title": "Countable Sets",
    "description":
      "> What qualifies a set as countable?\n> If \\(A\\) and \\(B\\) are countably infinite, is \\(A \\cup B\\) countable?\n> Is the set of rational numbers \\(\\mathbb{Q}\\) countable?\n\n\n\n[spoiler]\n\nDefinitions\n* A set \\(C\\) is countable iff its elements can be listed in order.\n* A set \\(C\\) is countably infinite iff there's a bijection between \\(C\\) and the natural numbers.\n* A set is countable iff it is finite or countably infinite.\n\nUnions\n* If \\(A\\) and \\(B\\) are countably infinite sets, then so is \\(A \\cup B\\). A valid way of listing the union is \\(a_0, b_0, a_1, b_1, ...\\).\n* Note that \\(a_0, a_1, ..., b_0, ...\\) is not a valid listing because \\(b_0\\) doesn't have a finite index.\n\nCross Products\n* The cross product of two countable sets is also countable.\n* The set of rational numbers \\(\\mathbb{Q}\\) is countable (it's the cross product of the set of integers with itself, i.e. \\(\\mathbb{Z} \\times \\mathbb{Z}\\)).\n* Infinity times infinity (whatever that means) doesn't result in a larger infinity.",
    "tags": "set_theory cos340 mathematics",
    "urgency": 4.26,
    "parent": "",
  },

  {
    "title":
      "Complex Instruction Set Computer (CISC) vs. Reduced Instruction Set Computer (RISC)",
    "description":
      "| CISC | RISC |\n| --- | --- | \n| Complex, powerful instructions | Simple, do-only-one-thing instructions |\n| Many memory addressing modes | Typically only base+displacement |\n| Hardware interpretation is complex | Hardware interpretation is simple |\n| Need relatively few instructions to do a given job | Need more instructions |\n| Examples: x86-64 (e.g. laptops, PCs) | Examples: ARM (e.g. phones, raspberry pi) |\n\n* As compilers get smarter, much motivation for RISC disappears.",
    "tags": "cos217 hardware",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Silicon Valley Season 5",
    "description":
      "**Episode 05: Facial Recognition**\n\n* Jared: Yeah, I'm happy to be here. I did have to cancel a speaking engagement this afternoon with an under-privileged middle school computer education class, but I suppose being abandoned by a role model is in itself an important life lesson.\n* Jared: Besides, I have a life-long aversion to my own image. It's like my foster mother used to say, \"Donald, you have a face for the closet.\" ",
    "tags": "tv_quotes silicon_valley_hbo",
    "urgency": 1,
    "parent": "",
  },

  {
    "title": "Good Old SQL vs Shiny ML",
    "description":
      "* Motivated by this [post](https://threadreaderapp.com/thread/987602838594445312.html) as [discussed on Hacker News](https://news.ycombinator.com/item?id=16898827)\n\n* Do you really need ML in order to:\n1. Find the customer of the week?\n2. Find customers that shopped once but haven't come back in a long time?\n3. Identifying potential fraud cases?\n\n* ML is however more suited than SQL for:\n\n1. Extracting features, e.g. \"What factors influence bad reviews\"?\n2. Recommending items and identifying new trends.\n\n* For most data operations, ~95% of the payoff comes from data cleaning and some SQL. Handle the basics first.",
    "tags": "machine_learning articles",
    "urgency": 1,
    "parent": "",
  },

  {
    "title": "Hate (Arthur C. Clarke)",
    "description":
      "* Breakfast, of course, was the same as always. The best thing that could be said of Joey's cooking was that there was plenty of it.\n* In the sea, nothing was ever safe or certain. You took your chances with open eyes - and if you lost, there was no point in whining.\n* There was no room for logic or reason in this orgasm of hate; he did not pause to think, for he dared not.\n* As she lay at Tibor's feet, she was neither a Russian nor the first human being to have seen the far side of the moon; she was merely the girl that he had killed.",
    "tags": "fiction books arthur_clarke book_excerpts",
    "urgency": 2,
    "parent": "",
  },

  {
    "title": "Turing Machines: Universality & Duality",
    "description":
      "> How does a Turing Machine work?\n> Decribe the duality and universality of Turing Machines.\n\n\n\n[spoiler]\n\n* There's a tape, a state control unit, and a table that contains the next state, output value and move L/R for any combination of input state and current input.\n* The ingenuity (and 90% of the work) lies in creating the table.\n* **Duality:** Hardware can be expressed as software, e.g. *adopting the convention program -> star -> input -> star -> program 2 -> star -> input 2 -> ...*\n* **Universality:** There exists a TM that contains all TMs, e.g. *adder TM, square TM, that only needs one piece of hardware - an interpreter that knows where each smaller TM is.*",
    "tags": "cos340 cs_theory",
    "urgency": 1,
    "parent": "",
  },

  {
    "title": "Problem Solving Techniques",
    "description":
      "> Give examples on when these problem solving techniques are appropriate:\n* Defining a recurrence relation.\n* Manipulating the definitions.\n* Analyzing all possible cases.\n\n\n\n[spoiler]\n\n### Define a recurrence and identify base/boundary conditions\n* Useful when knowing a previous state helps you find the next state.\n* Techniques include plug-and-chug and solving for characteristic equation.\n\n### Manipulating the Definitions\n* Useful for proving general statements with little to no specificity.\n\n### Analyzing all possible cases\n* Sometimes there's an invariant that summarizes all possible cases into a few cases, e.g. *Ramsey's 3 mutual friends/enemies for n >= 6*\n",
    "tags": "cos340 mathematics",
    "urgency": 3.91,
    "parent": "",
  },

  {
    "title": "Proof Techniques",
    "description":
      "> How do we go about proofs by induction? By contradiction? Using known principles?\n\n\n\n[spoiler]\n\n#### Induction\n* Useful when you can index all the possible cases.\n* Needs a predicate, base case and inductive step.\n* Induction on graphs may require starting from \\(n+1\\), shrinking to \\(n\\) then growing back to \\(n+1\\)\n\n#### Contradiction\n* Useful for decision problems when you have a few statements to work with. Assume the worst and hope for a contradiction.\n\n#### Invoking known principles/proofs\n* Hall's Theorem tells us if a perfect matching exists in a graph G.\n* Inclusion-Exclusion Principle can identify over-counting by counting in different ways.\n* Pigeonhole Principle shows that one set is greater than the other.",
    "tags": "cos340",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "Unix I/O",
    "description":
      "* The first 3 indices in the file descriptor table have pointers to the file tables for stdin, stdout & stderr, respectively.\n* File descriptor is an int that uniquely identifies an open file, e.g. 0 is originally for the stdin file table.\n* Unix I/O functions are `creat, open, read, write, lseek, close` ... and that's it for I/O from all kinds of devices!\n* When a new file is opened, the pointer to its file table is stored at the first unused file descriptor.\n* Beautiful interface, but really slow because these are system calls. System calls are slow because of context switching.\n",
    "tags": "cos217 programming linux",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Standard C I/O",
    "description":
      "* These require `#include <stdio.h>`\n* Popular I/O functions: `FILE *fopen, int fclose, int fflush, int fseek, int ftell`\n* Popular input functions: `int fgetc, int getchar, char *fgets, char *gets, int fscanf, int scanf`\n* Popular output functions: `int fputc, int putchar, int fputs, int puts, int fprintf, int printf`\n* Standard C I/O functions have buffers, which makes calls like `fgetc` more efficient by reducing # calls to `read`.\n",
    "tags": "c cos217 c_system linux",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "I/O Redirection",
    "description":
      "* `dup()` is a system-level function that duplicates the provided file descriptor (int) at the lowest-numbered unused descriptor.\n* A recipe for `somepgm > somefile` would be like:\n```\npid = fork();\nif (pid == 0) {\n    fd = creat(\"somefile\", 0600);\n    close(1); /* Close stdout */\n    dup(fd); /* A copy of fd will be created where stdout was */\n    close(fd);\n    execvp(somepgm, someargv);\n    fprintf(stderr, \"exec failed\\n\");\n    exit(EXIT_FAILURE);\n}\n```\n",
    "tags": "c cos217 c_system",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Process Management",
    "description":
      "* Explain how `pid_t fork()` works. Give examples of processes that use forks.\n* How do you ensure the child finishes executing before the parent does some other logic?\n* Describe children, orphans and zombies and how the OS maintains process sanity.\n\n\n\n[spoiler]\n\n* Creating new processes is essential, e.g. *web server receives request; creates additional instance of itself to handle the request; original instance keeps listening for requests*.\n* `pid_t fork()` creates a new process. It returns `0` if its in the child, or the process id if it's in the parent.\n* Here's a recipe to make sure the child finishes executing before parent proceeds:\n```\n/* #include unistd.h, sys/types.h and wait.h */\npid = fork();\nif (pid == 0) {\n    /* Let the child do its own thing */\n    exit(EXIT_SUCCESS);\n}\npid = wait(NULL);  /* Remember to check for the error case: pid == -1 */\n/* At this point, the child definitely finished executing */\n```\n* Zombies are children that have not been waited on. Orphans are children whose parents already terminated.\n* Process 1 runs on startup. It goes waiting for all the orphans. If some orphan never terminates, it's up to no good!\n",
    "tags": "c c_system cos217",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "A Minimal Shell",
    "description":
      "* A shell is one never ending loop.\n* Remember that `someargv[0]` should equal `somepgm`, and the last item in `someargv` should be `NULL`.\n```c\n/* Parse command line */\n/* Assign values to somepgm, someargv */\npid = fork();\nif (pid == 0) {\n    execvp(somepgm, someargv);\n    fprintf(stderr, \"exec failed\\n\");\n    exit(EXIT_FAILURE);\n}\nwait(NULL);\n/* Repeat the previous */\n```\n",
    "tags": "c c_system cos217",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Exceptions",
    "description":
      "* How does handling exceptions differ from calling functions?\n* For each of these exception classes: *interrupt, trap, fault, abort*, describe their cause, sync/async nature and next state. Provide examples.\n\n[spoiler]\n\n* Handling exceptions differ from calling functions in a couple of ways:\n1. CPU pushes additional data (e.g. registers' contents) to the OS's (not the program's) stack.\n2. Handler runs in kernel/privileged mode (e.g. can modify page tables) and not in user mode.\n3. Control might return to the same/next instruction, or never at all..\n\n#### Summary of Exception Classes\n* **Interrupt:** External device requests attention. Asynchronous. Return to next instruction. *e.g. key press, hardware timer expires, disk controller finishes I/O*.\n* **Trap:** Program requests OS service. Synchronous. Return to next instruction. *e.g. `brk(), read(), creat()`*\n* **Fault:** Program causes (maybe recoverable) error. Synchronous. Maybe return to current instruction. *e.g. division by zero, page fault, seg fault*\n* **Abort:** Hardware detects non-recoverable error. Synchronous. Do not return. *e.g. overheating, cosmic ray!*\n",
    "tags": "cos217 c c_system linux",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Assembly 101: Instructions and Byte Order",
    "description":
      "The following data types are available:\n```assembly\n.byte # 1 byte\n.word # 2 bytes\n.long # 4 bytes\n.quad # 8 bytes\n```\n* Other keywords worth remembering: `.globl, label, .section, .skip, .string`\n\n* Many instructions have the format `name{b, w, l, q} src, dest`\n* Immediate operands, e.g. `$5, $some_address` can only be source operands.\n* Register operands e.g. `%rax, %al` can be source or destination operands.\n* Memory operands e.g. `5, some_address` can be source or destination operands, but not both.\n* Multiplication and division instructions differ between signed and unsigned operands, e.g. `imulq` vs `mulq`.\n\n* Beware of byte order (little endian vs big endian), e.g. say you have `unsigned int i = 0x003377ff`\n* On little endian e.g. courselab, `i` will be stored as `/* byte 0 */ ff 77 33 00 /* byte 3 */ `\n* In a big endian machine, `i` will be stored as `/* byte 0 */ 00 33 77 ff /* byte 3 */`\n",
    "tags": "assembly cos217",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Assembly: Addressing (Memory Operands)",
    "description":
      "* **Immediate operands:** `$5` or `$i` \\\\( \\\\implies \\\\) use the address that is available immediately within the instruction.\n* **Direct:** `5` or `i` \\\\( \\\\implies \\\\) load from (or store to) memory at the address denoted by i\n* **Indirect:** `(%rax)` \\\\( \\\\implies \\\\) use the address stored in `%rax`\n* **Base + Displacement:** `5(%rax)` or `i(%rax)` \\\\( \\\\implies \\\\) Use the sum `i + (contents of %rax)` as the address\n* **Indexed:** `5(%rax, %r10)` or `i(%rax, %r10)` \\\\( \\\\implies \\\\) Use the sum `i + (contents of %rax) + (contents of %r10)` as the address.\n* **Scaled Index:** `5(%rax, %r10, 4)` or `i(%rax, %r10, 4)` \\\\( \\\\implies \\\\) Use the sum `i + (contents of %rax) + 4 * (contents of %r10(` as the address.\n\nThe `lea` instruction is quite subtle:\n```assembly\nmovq 5(%rax), %r10 # Load a quad from memory address `5 + (contents of %rax)` into `%r10`\nleaq 5(%rax), %r10 # Move the sum `5 + (contents of %rax)` into `%r10`\n```\n\n\n",
    "tags": "assembly cos217",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Data Types and Their Sizes",
    "description":
      "On courselab's C, the data type sizes are,\n```c\nchar c; /* 1 byte */\nshort s; /* 2 bytes */\nfloat f; /* 4 bytes */\nint i; /* 4 bytes */\ndouble d; /* 8 bytes */\nint *pi; /* 8 bytes. Any pointer, really. We're working with 64-bit machines */\nlong double ld; /* 16 bytes but only 10 are used on x86-64 */\n```\n",
    "tags": "c cos217",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Building C Programs",
    "description":
      "**Pre-processing** e.g. `gcc217 -E charcount.c > charcount.i`\n\n* Removes comments\n* Replaces pre-processor directives, e.g. `#include <stdio.h>` with function declarations but not definitions, `EOF` is replaced by `-1`, etc.\n\n**Compiling** e.g. `gcc217 -S charcount.i > charcount.s`\n\n* Translates from C to assembly.\n* Compiler checks that calls of functions match the declarations that were inserted in the pre-processing stage.\n\n**Assembling** e.g. `gcc217 -c charcount.s > charcount.o`\n\n* Generates TEXT, RODATA, DATA, BSS sections containing machine language code, e.g. `movq $msg1, %rdi` \\\\( \\\\implies \\\\) `5: 48 c7 c7 00 00 00 00 mov $0x0, %rdi`.\n* Generates relocation records, e.g. in `movq $msg1, %rdi`, the compiler only knows the offset of `msg` in the `.data`, but not the address of `.rodata`. The assembler will therefore add `8: R_X86_64_32S .rodata` which means *\"@linker, once you determine the address of `.rodata` please patch in a 32-bit signed value at the TEXT section at offset \\\\(08\\_H\\\\).\"*\n\n**Linking** e.g. `gcc217 charcount.o -o charcount`\n\n* Resolve references to make code complete, e.g. fetching ML code for `getchar` and adding it to the TEXT section.\n* Traverses relocation records to patch code, e.g.\n```assembly\n11: e8 00 00 00 00 callq 16<main+0x16>\n                    12: R_X86_64_PC32 getchar-0x4\n```\nnow becomes (note the real memory addresses, no longer offsets):\n```assembly\n400525: e8 ee fe ff ff callq 400418 <getchar@plt> # [addr of getchar] - 0x40052a = -274 = 0xfffffeee\n40052a: ....\n```\n\n",
    "tags": "cos217 c c_system",
    "urgency": 2,
    "parent": "",
  },

  {
    "title": "Locality and Caching",
    "description":
      "```c\nsum = 0;\nfor (i = 0; i < n; i++) sum += a[i];\n\n```\n* Identify temporal locality and spatial locality in the snippet above. Both in terms of data and instructions.\n* How do hierarchical caches work?\n* How can you add caching and locality to your code? Any practical problems where this matters?\n\n\n[spoiler]\n\nTemporal locality\n\n* Data: whenever `sum` is accessed, it's accessed again shortly after\n* Instructions: whenever `sum += a[i]` is executed, it is executed shortly after.\n\nSpatial locality\n\n* Data: whenever CPU accesses `a[i]`, it accesses `a[i+1]` shortly after.\n* Instructions: whenever CPU executes `sum += a[i];` it executes `i++;` shortly after.\n\nHierarchical Caches, e.g. L1, L2, L3\n\n* If block 8 is not at level \\(k\\), evict some block from level \\(k\\) to level \\(k+1\\), then load block 8 from level \\(k+1\\) to level \\(k\\).\n* The Least Recently Used (LRU) cache eviction policy is expensive unless we include some heuristics.\n\nProgramming Tip\n\n* Caching is done by the system. Locality is all up to you, e.g. *C stores 2D arrays in row-major order. If you're working with 2D arrays, for instance matrix multiplication, your accesses better be traversing across the rows!*\n",
    "tags": "c cos217 memory",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "The Private Address Space Illusion",
    "description":
      "**Converting between virtual memory and physical memory**\n\n* On courselab, virtual addresses are 64 bits. The first 52 bits are the virtual page number, and the last 12 are the offset.\n* However, physical addresses are 37 bits (\\\\(2^{37}\\\\) = 128GB per computer), with the first 25 bits being the physical page number.\n* Suppose the program wants to access virtual address 16386 (= 0x4002), which is virtual page 4 and offset 2.\n* To get the physical address, look up physical page corresponding to virtual page 4 in the page tables. The offset will be the same. Only the OS/hardware know the physical address.\n\n**Possible Scenarios:**\n\n* The physical address is on physical memory. Yay!\n* The physical address is not on physical memory. Page fault! OS pauses the program, takes charge of CPU, swaps missing page with one on disk, updates page tables, then re-executes the same instruction once the program resumes.\n* The physical address is unmapped. Seg Fault! OS will probably kill the (naughty) process.\n\n**Aside**\n\n* Page tables are stored in main memory. Since they are accessed frequently, they are likely to be in L1/L2/L3. Furthermore, X86-64 provides special-purpose hardware support for virtual memory.\n",
    "tags": "cos217 programming c_system",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Finite Representation of Signed Integers (4-bit machine)",
    "description":
      "**Sign-Magnitude**\n\n* High-order bit indicates sign, remaining bits indicate magnitude, e.g. \\(5_D = 0101_B\\)\n* To negate, flip the high-order bit.\n* Symmetric, but there are 2 representations of zero \\(1000_B, 0000_B\\)\n\n**One's Complement**\n\n* High-order bit has a weight of \\(-7\\), e.g. \\(-5_D = -7_D + 2_D = 1010_B\\)\n* To negate, flip all the bits.\n* Symmetric, but \\(1111_B\\) and \\(0000_B\\) are both zero.\n\n**Two's Complement**\n\n* High-order bit has a weight of \\(-8\\), e.g. \\(-5_D = -8_D + 3_D = 1011_B\\)\n* To negate, flip all the bits then add 1.\n* Asymmetric, but we have one representation of zero and the same algo for adding signed and unsigned integers.\n \n",
    "tags": "cos217",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Dynamic Memory Management",
    "description":
      "Describe how `malloc` and `free` are implemented in these DMM implementations: *minimal, padded, list*\nComment on the space and time usage of each implementation.\n\n\n\n[spoiler]\n**Minimal Implementation (Heap Section)**\n\n* `malloc`: Call `brk(pBrk + n)` for every `malloc(n)`.\n* `free`: Not implemented.\n* Time: Bad. Each `malloc(n)` has a system call. But each `free(p)` is constant time.\n* Space (bad): No reuse of freed chunks. No overhead per object.\n* Substantial external fragmentation even for client with uniform-sized objects.\n\n**Pad Implementation (Heap Section)**\n\n* `malloc`: Check heap's tail. If we don't have enough room, call `brk(pBrk + greater_than_n)`.\n* `free`: Not implemented.\n* Space (bad): No reuse of freed chunks.\n* Time (good): Most `malloc` don't have system calls. `free` is \\(O(1)\\).\n\n**List Implementation (Heap Section)**\n\n* `malloc`: Scan free list for first-fit. Split chunk if it's too big. If non-available, `brk` for more than enough, use and split.\n* `free`: Scan list to get `prev_chunk_in_mem`. Free chunk and coalesce with neighbors if possible.\n* Space (good): `size + next` \\( = 4 + 4 + 8 = 16\\) bytes header overhead. Some internal & external fragmentation is unavoidable.\n* Time (bad): \\(O(n)\\) for `malloc` isn't bad, but \\(O(n)\\) for `free` is terrible!\n\n",
    "tags": "c memory cos217",
    "urgency": 3,
    "parent": "",
  },

  {
    "title": "Faulhaber's Formula",
    "description":
      "If we wish to compute sums of consecutive powers, [Faulhaber's formula](https://brilliant.org/wiki/sum-of-n-n2-or-n3/) provides a neat way to do it:\n\n$$ \\sum_{k=1}^{n} k^a = \\frac{1}{a+1} \\sum_{j=0}^{a} (-1)^{j} \\binom{a+1}{j} B_j n^{a+1-j} $$\n\nwhere \\(B_j\\) is the \\(j\\)-th Bernoulli number, more specifically, \\(B_{j}^{+}\\) where \\(B_{j}^{1} = \\frac{1}{2}\\). The Bernoullis can be generated using:\n\n$$ B\\_{j}^{+} = 1 - \\sum_{k=0}^{j-1} \\binom{j}{k} \\frac{B_{k}^{+}} {j - k + 1} $$\n\n\nFaulhaber's formula for \\(a = 1, 2, 3\\) reduces to:\n\n\n$$ \\frac{n(n+1)} {2} ,\\ \\frac{n(n+1)(2n+1)} {6} ,\\ \\frac{n^2(n+1)^2} {4} $$\n",
    "tags": "algorithms mathematics hard_programming_challenges",
    "urgency": 3.91,
    "parent": "",
  },

  {
    "title": "Pythagorean Triplets",
    "description":
      "> A Pythagorean triplet is a set of three natural numbers, \\(a < b < c\\) for which \\(a^2 + b^2 = c^2\\). Given \\(N\\), check if there exists any Pythagorean triplet for which \\(a + b + c =N\\).\n\n\n[spoiler]\n\nReducing the number of variables will reduce our search space. Look at this masterpiece from [Project Euler](https://projecteuler.net/thread=9):\n\nLet \\(a = 2mn, b = m^2 - n^2, c = m^2 + n^2\\) because \\( 4m^2n^2 + m^4 - 2m^2n^2 + n^4 = m^4 + 2m^2n^2 + n^4 \\).\n\n\\( 2mn + m^2 - n^2 + m^2 + n^2 = 2m(n+m) = N \\implies m(n+m) = \\frac{N}{2} \\)\n\n```c\nwhile (m < sqrt(N/2)) {\n    n = N/(2.0 * m) - m;\n    if (floor(n) == n) return true;\n    m += 1;\n}\nreturn false;\n```\n",
    "tags": "algorithms algebra medium_programming_challenges",
    "urgency": 5.96,
    "parent": "",
  },

  {
    "title": "Arthur C. Clarke, Love that Universe (1961)",
    "description":
      "* We must face the facts without flinching; we must not let our emotions sway our logic. Indeed, we must do the precise opposite: *we must let our logic sway our emotions!*\n\n* We share a universe with creatures who can juggle with the very stars. If they choose to help, it would be child's play for them to deflect a body like the Black Dwarf.\n\n* Even if we could strike all humanity with a simultaneous moment of terror, the impulse could not be detected more than two thousand light-years away. We need at least four times this range. And we can achieve it - *by using the only emotion that is more powerful than fear.*\n\n* We realize that there will be protests, cries of outrage, refusals to co-operate. But when one looks at the matter logically, is the idea really so offensive? Many of us think that, on the contrary, it has a certain appropriateness - even a poetic justice.\n",
    "tags": "arthur_clarke fiction books book_excerpts c13u_diaries",
    "urgency": 3.29,
    "parent": "",
  },

  {
    "title": "Graph Representation: Adjacency Matrix (A)",
    "description":
      "* What's the advantages and disadvantages of representing a graph using an adjacency matrix?\n* What does the \\(i, j\\) entry of \\(A^k\\) represent?\n* What's the complexity of matrix multiplication in practical settings?\n* What does \\(A^T\\) represent in an undirected graph? What about in a directed graph?\n\n\n\n[spoiler]\n\n* Although we need \\(O(|V|^2)\\) space even for sparse graphs \\((|E| << |V|^2)\\), we can use linear algebra machinery.\n* Theorem: *Even with self-loops, the \\((i, j)\\) entry of \\(A^k\\) is equal to the numbers of walks of length \\(k\\) from \\(v_i\\) to \\(v_j\\)*. The proof uses induction on \\(k\\) and properties of matrix multiplication.\n\n* \\(N \\times N\\) Matrix multiplication complexity: [Coppersmith-Winograd's algorithm](https://en.wikipedia.org/wiki/Coppersmith%E2%80%93Winograd_algorithm) is \\(O(N^{2.37})\\) but it's only advantageous for matrices that can't fit in current hardware. [Straseen's algorithm](https://en.wikipedia.org/wiki/Strassen_algorithm), \\(O(N^{2.81})\\) is used in practical applications.\n\n* In adjacency matrix representation, we can encode weights directly into the adjacency matrix (and use \\(0\\) or \\(\\infty\\) for edges that don't exist.\n\n* In undirected graphs, \\(A^T = A\\), but in a directed graph, \\(A^T\\) represents the graph formed if all edges in \\(G\\) were reversed. This transpose takes \\(O(V^2)\\)-time.\n",
    "tags": "cos340 graph_theory algorithms",
    "urgency": 5,
    "parent": "",
  },

  {
    "title": "Graph Representation: Adjacency Lists",
    "description":
      "* Adjacency list representation requires \\(O(|V| + |E|)\\) space.\n* Algorithms that scan through adjacency list representations typically take \\(O(|V| + |E|)\\)-time. The \\(|V|\\) should be included because even if there were no edges, we'd still need to look through \\(|V|\\) adjacency lists.\n* If we used hash-sets for the adjacency lists, the lookup time for whether an edge \\((u, v)\\) exists would be \\(O(1)\\) with the chance of being \\(O(|V|)\\) if our hash function is garbage.\n* If we maintained sorted adjacency lists, we'd be guaranteed \\(O(lg |V|)\\) lookup time in all cases.\n\n**Exercises**\n\n* Reverse the edges of a graph in \\(O(|V| + |E|)\\)-time.\n* Compute the in-degree of every vertex in \\(O(|V| + |E|)\\)-time and similarly, out-degree in \\(O(|V| + |E|)\\)-time.\n* Remove multiple edges and self-loops in \\(O(|V| + |E|)\\)-time",
    "tags": "graph_theory algorithms",
    "urgency": 6,
    "parent": "",
  },

  {
    "title": "The Square of a Directed Graph, G",
    "description":
      "* \\(G^2 = (V, E^2)\\) is such that \\((u,v) \\in E^2\\) iff \\(G\\) contains a path with at most 2 edges between \\(u\\) and \\(v\\).\n* In an adjacency matrix representation, we'd replace all ones and twos in \\(A^2\\) with 1s and the rest with zeros. \\(O(|V|^{2.81})\\)\n* In an adjacency list representation, we'd first compute \\(G^T\\), which takes \\(O(|V| + |E|)\\)-time, and then:\n```\nfor v in G.V() {\n    for u in G.adj(v) {\n        G_new.adj(v).insert(u);\n        for w in G_transpose.adj(v) {\n            G_new.adj(u).insert(w);\n        }\n    }\n}\n```\n* The algorithm above takes \\(O(|E||V| + |V|)\\)-time. It's possible to take \\(|V|\\)-time when processing each edge.\n",
    "tags": "algorithms graph_algorithms",
    "urgency": 5,
    "parent": "",
  },

  {
    "title": "A Linear-Time Algorithm for Checking Universal Sinks in Graphs",
    "description":
      "* A universal sink has an in-degree of \\(|V| - 1\\) and an out-degree of \\(0\\).\n* If we're given an adjacency matrix \\(A\\), here's a linear algorithm to find a universal sink if one exists:\n```\nrow, col = 1, 1;\ntarget = length(G.V()) - 1;\nwhile (row <= target && col <= target) {\n    if (A[row][col] == 1) row += 1;\n    else col += 1;\n    if (row == target || col == target) return row;\n}\nreturn -1;\n```\nHere's the guarantee. Suppose the universal sink is on row \\(k\\).\n\n* Once column \\(k\\) is hit, we'll move down until we get to row \\(k\\).\n* Once row \\(k\\) is hit, we'll move right until our column number equals the target.\n",
    "tags": "algorithms graph_algorithms",
    "urgency": 5,
    "parent": "",
  },

  {
    "title": "Interpreting Adjacency Matrix Manipulations",
    "description":
      "* How are the cells of an adjacency matrix defined?\n* If \\(B\\) is an adjacency matrix, what does \\(BB^T\\) represent?\n\n\n[spoiler]\n\nThe incidence matrix of a directed graph \\(G = (V, E)\\) with no self-loops is a \\(|V| \\times |E|\\) matrix \\(B = (b_{ij})\\) such that \\(b_{ij}\\) is:\n\n* \\(-1\\) if edge \\(j\\) leaves vertex \\(i\\)\n* \\(1\\) if edge \\(j\\) enters vertex \\(i\\)\n* \\(0\\) otherwise.\n\nWhat do the entries of \\(BB^T\\) represent, where \\(B^T\\) is the transpose of \\(B?\\)\n\n**Strategy: Express \\(B^T\\) using \\(B\\) so that you have fewer things to consider**\n\n* Note that \\(b_{ij}\\) is the dot product of row \\(i\\) in \\(B\\) and column \\(j\\) in \\(B^T\\).\n* Further note that column \\(j\\) in \\(B^T\\) is the same as row \\(j\\) in \\(B\\).\n* For each diagonal entry, \\(b_{ii}\\) is row \\(i\\)'s dot product with itself, which is the sum of the in-degree and out-degree of the vertex that \\(i\\) corresponds to.\n* For each non-diagonal entry, no term in the dot product can be \\(1\\) since two vertices can't be on the same side of an edge. Therefore, \\(b_{ij}\\) will be \\(-1\\) if there's an edge between vertex \\(i\\) and vertex \\(j\\), and zero otherwise.\n",
    "tags": "graph_theory algorithms algebra",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "AskReddit: What popular life advice do you disagree with?",
    "description":
      "[Original Thread](https://www.reddit.com/r/AskReddit/comments/8myoj7/what_popular_life_advice_do_you_disagree_with/)\n\n\n\n* Things will get better if you persevere. The whole sunk costs fallacy. Nope, maybe starting over is better.\n\n\n* You can do whatever you want if you put your mind to it. Then more than 90% of pro pitchers who can't throw over 100mph are just not putting their mind to it!\n\n\n\n* Absence makes the heart grow fonder. Actually, the full saying has *..., too much absence makes it wander.* Absence is to love what wind is to fire; it extinguishes the small, and kindles the great.\n\n\n* Do what you love and you'll never work a day of your life. Follow your dreams. Actually, do something that pays you well enough to have hobbies. And it's okay not to have a dream.\n\n\n\n* Cheaters never prosper. One of the necessary lies of civilizations - it's okay if some cheat, but if everybody did, the society would crumble.\n\n\n* Be yourself. Nah, put in effort to work on your weaknesses.\n\n\n\n* Love will happen when you least expect it. Passivity won't help. Can't force romance, but go to parties, clubs, etc.\n\n\n* Family is family no matter what. Sometimes they're shitty people you happened to grow up with (or didn't).\n\n\n* Always respect and listen to your elders. Remember that pricks also grow old.\n\n\n* Forgiveness is for you and not the forgiven. Nope, fuck some people :-/\n\n\n",
    "tags": "c13u_diaries",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "Recursive Binary Search",
    "description":
      "* When is binary search a good option? How can we search unbounded arrays? Okay, what about really huge arrays?\n* Write a recursive implementation of binary search.\n\n\n\n[spoiler]\n\n```c\nint binary_search(item_type a[], item_type key, int lo, int hi){\n    int mid;\n    if (lo > hi) return -1;\n    mid = lo + (hi - lo) / 2; /* mid = (lo + hi) / 2 is correct, but might overflow */\n    if (a[mid] == key) return mid;\n    if (a[mid] > key) return binary_search(a, key, lo, mid-1);\n    else return binary_search(a, key, mid+1, hi);\n}\n```\n* One sided binary search uses exponentiation \\(a[1], a[2], a[4], a[8], ...\\) to find the upper bound for binary search, *e.g. in root finding.*\n* If we have additional info, e.g. distribution of keys, we can converge faster at the cost of a less robust implementation. It's not usually worth it, but there's a DP algorithm to find the optimal search tree if you're interested.\n* At times we might benefit by moving all recently searched keys to the front.\n* If keys might be on external memory, binary search will be slowed down by its wild jumps. Use b-trees or Emde Boas trees.",
    "tags": "programming data_structures algorithms binary_search",
    "urgency": 6.5,
    "parent": "",
  },

  {
    "title":
      "Key-Indexed Counting for sorting items whose keys are small integers",
    "description":
      "```java\nint N = a.length;\n\n// Initialization takes N + R + 1 array accesses\nString[] aux = new String[N];\nint[] count = new int[R+1] // Assuming we have at R distinct integer keys\n\n// Compute the frequency counts for each key (2N array accesses)\nfor (int i = 0; i < N; i++) count[a[i].key() + 1]++;\n// Transform the counts to indices (2R array accesses)\nfor (int r = 0; r < R; r++) count[r+1] += count[r]\n// Distribute the records. Notice that this step is a stable sort (3N array accesses)\nfor (int i = 0; i < N; i++) aux[count[a[i].key()]++] = a[i];\n// Copy the items back into the original array (2N array accesses)\nfor (int i = 0; i < N; i++) a[i] = aux[i];\n```\n* Viola! The sort is achieved using \\(8N + 3R + 1\\) array accesses.\n* Note that the \\(N log (N)\\) lower bound is for the number of compares. Key-indexed counting does no compares.\n",
    "tags": "string_processing algorithms",
    "urgency": 5,
    "parent": "",
  },

  {
    "title":
      "Least Significant Digit (LSD) String Sort for Fixed-Length Strings",
    "description":
      "```java\nint N = a.length; String[] aux = new String[N];\n\n// Sort by key-indexed counting on d'th character\nfor (int d = W-1; d >= 0; d--) {\n    int[] count = new int[R+1];\n\n    // Compute frequency counts\n    for (int i = 0; i < N; i++) count[a[i].charAt(d) + 1]++;\n    // Transform counts to indices\n    for (int r = 0; r < R; r++) count[r+1] += count[r];\n    // Distribute the items\n    for (int i = 0; i < N; i++) aux[count[a[i].charAt(d)]++] = a[i];\n    // Copy back the items\n    for (int i = 0; i < N; i++) a[i] = aux[i];\n}\n```\n* LSD sort works because key-indexed counting is stable. If so far some keys are equal, they'll remain in their relative positions until a difference is noticed in the more significant digits.\n* LSD sort uses \\(N + R\\) extra space, and \\(~7WN + 3WR\\) array accesses. Since \\(N >> R\\), the sort is linear in \\(WN\\) which is the total number of characters in the input.\n",
    "tags": "string_processing sorting algorithms",
    "urgency": 6,
    "parent": "",
  },

  {
    "title":
      "Most-Significant-Digit-First (MSD) String Sort for General (Random) Strings",
    "description":
      "```java\n\nprivate static int R = 256;\nprivate static final int cut_off = 15; // Experiments suggest ~sqrt(R)\nprivate static String[] aux;\n\n// e.g. for 'AAA' and 'AAAD', we need a convention for s.charAt(3)\nprivate static int charAt(String s, int d)\n{   if (d < s.length()) return s.charAt(d); else return -1; }\n\n// Special insertion sort that assumes the first d characters are equal\nprivate static void insertionSort(String[] a, int lo, int hi, int d) {\n    for (int i = lo; i <= hi; i++) {\n        for (int j = i; j > lo && less(a[j], a[j-1], d); j--) { exchange(a, j, j-1); }\n    }\n}\n\n// God bless Java for making substring() a constant-time operation.\n// Sike! From JDK 7, substring() creates a new copy. Goodbye constant-time\nprivate static boolean less(String v, String w, int d)\n{    return v.substring(d).compareTo(w.substring(d)) < 0; }\n\n// Defining aux here saves space but sacrifices sort stability\npublic static void sort(String[] a)\n{    int N = a.length; aux = new String[N]; sort(a, 0, N-1, 0); }\n\n// Sort from a[lo] to a[hi], starting at the dth character.\nprivate static void sort(String[] a, int lo, int hi, int d) {\n    // Critical: For small subarrays, do insertion sort because initializing\n    // count and transforming to indices will dominate the cost\n    if (hi <= lo + cut_off) {insertionSort(a, lo, hi, d); return; }\n\n    // Each recursive call needs its own count.\n    // If R is huge, we'll run out of memory soon!\n    int[] count = new int[R+2];\n    for (int i = lo; i <= hi; i++) count[charAt(a[i], d) + 2]++;\n    for (int r = 0; r < R+1; r++) count[r+1] += count[r];\n    for (int i = lo; i <= hi; i++) aux[count[charAt(a[i], d) + 1]++] = a[i];\n    for (int i = lo; i <= hi; i++) a[i] = aux[i - lo];\n\n    // For random strings, only a few recursions will be needed.\n    // If we have lots of equal keys, RIP efficiency especially on space usage.\n    for (int r = 0; r < R;  r++) { sort(a, lo+count[r], lo+count[r+1]-1, d+1); }\n}\n```\n* Performance-wise, MSD string sort for random strings is \\(Nlog_R(N)\\) which is sublinear in number of characters, nearly linear for inputs with many equal keys, and in the worst case (all strings equal) the same as LSD - linear.\n* MSD uses between \\(8N + 3R\\) and \\(~7wN + 3WR\\) array accesses to sort \\(N\\) strings, \\(w\\) = average string length\n",
    "tags": "string_processing algorithms",
    "urgency": 6,
    "parent": "",
  },

  {
    "title": "Three-way String Quicksort",
    "description":
      "```java\nprivate static final int CUTOFF = 15;\n\npublic static void sort(String[] a)\n{    StdRandom.shuffle(a); sort(a, 0, a.length-1, 0); }\n\n// To use an alphabet, s.charAt(d) becomes alpha.toIndex(s.charAt(d))\n// But charAt is accessed at an inner loop and would slow down the code\nprivate static int charAt(String s, int d)\n{    if (d == s.length()) return -1; return s.charAt(d); }\n\nprivate static void sort(String[] a, int lo, int hi, int d) {\n    if (hi <= lo + CUTOFF) { insertSort(a, lo, hi, d); return; }\n\n    int lt = lo, gt = hi; int i = lo+1, v = charAt(a[lo], d);\n    while (i <= gt) {\n        int t = charAt(a[i], d);\n        if (t < v) exchange(a, lt++, i++);\n        else if (t > v) exchange(a, i, gt--);\n        else i++;\n    }\n  \n    // a[lo ... lt-1] < v = a[lt ... gt] < a[gt+1 ... hi]\n    sort(a, lo, lt-1, d); if (v >= 0) sort(a, lt, gt, d+1); sort(a, gt+1, hi, d);\n}\n\n// Exploit the fact that the first d characters are equal\nprivate static void insertionSort(String[] a, int lo, int hi, int d) {\n    for (int i = lo; i <= hi; i++) {\n        for (int j = i; j > lo && less(a[j], a[j-1], d); j--) exchange(a, j, j-1);\n    }\n}\n\n// Note that substring() in Java 7 is slow, so don't use it!\nprivate static boolean less(String v, String w, int d) {\n    for (int i = d; i < Math.min(v.length(), w.length()); i++) {\n        if (v.charAt(i) < w.charAt(i)) return true;\n        if (v.charAt(i) > w.charAt(i)) return false;\n    }\n    return v.length() < w.length();\n}\n\n```\n* The algorithm doesn't use extra space, other than the implicit recursion stack, which is \\(\\approx log (N)\\).\n* Standard qsort is MSD since it starts examining chars from L-R, but 3-way string qsort avoids comparing the equal leading chars of nearly identical strings.\n* If we have \\(N\\) keys of length \\(~L\\) with many equal leading chars, *e.g. web logs*, standard qsort runs in (\\(~L \\times 2Nln(N)\\))-time.\n* 3-way string qsort takes \\(NL\\) to discover all leading equal chars, PLUS \\(2Nlg(N)\\) to sort the remaining short keys, leading to \\(~2Nlg(N)\\)-time\n* Code obtained from [Sedgewick & Wayne](https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/Quick3string.java.html)\n",
    "tags": "string_processing sorting algorithms",
    "urgency": 6,
    "parent": "",
  },

  {
    "title": "Brute-Force Substring Search",
    "description":
      "```java\npublic static int search(String pat, String txt) {\n    int pat_length = pat.length(), txt_length = txt.length();\n    for (int i = 0; i < txt_length - pat_length; i++) {\n        int j;\n        for (int j = 0; j < pat_length; j++)\n            if (txt.charAt(i+j) == pat.charAt(j)) break;\n        if (j == pat_length) return i;\n    }\n    return txt_length;\n}\n\n// Alternate implementation with explicit backup\npublic static int search(String pat, String txt) {\n    int j, pat_length = pat.length();\n    int i, txt_length = pat.length();\n    for (i = 0, j = 0; i < txt_length && j < pat_length; i++) {\n        if (txt.charAt(i) == pat.charAt(j)) j++;\n        else { i -= j; j = 0; }\n    }\n    if (j == pat_length) return i - pat_length;\n    else return txt_length;\n}\n```\n* Code adapted from [Algorithms, Sedgewick & Wayne](https://algs4.cs.princeton.edu/53substring/Brute.java.html)\n\n### Remarks\n\n* In the analysis, \\(N\\) is the length of the text, while \\(M\\) is the length of the substring.\n* Nearly all compares find a mismatch in the first chars of the pattern, \\(\\approx N + M\\) char compares, *e.g. `ABRA` in `ABACADABRAC`*\n* However, it's possible to have \\(\\approx NM\\) char compares, especially in binary texts, *e.g. `AAAAB` in `AAAAAAAAAAAAB`*\n",
    "tags": "algorithms string_processing",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "Bottom-Up DP: The Rod Cutting Problem",
    "description":
      "> Given a rod of length \\(n\\) inches and a table of prices \\(p_i\\) for \\(i = 1, 2, ..., n\\), determine the maximum revenue \\(r_n\\) obtainable by cutting up the rod and selling the pieces. Use a bottom-up approach.\n\n\n\n[spoiler]\n\n\n* The bottom up approach solves sub-problems of size \\(j = 1, 2, ..., n\\) in that order.\n\n* This way, no problem is considered, until all of the sub-problems that it depends on are solved.\n\n```python\ndef bottom_up_rod_cutting(p, n):\n    r = [0] * (n+1)\n    for j in range(1, n+1):\n        q = -inf\n        # Of all the combinations whose lengths sum to j, which one gives me the most $$$?\n        for i in range(1, j+1): q = max(q, p[i] + r[j-i])\n        r[j] = q\n    return r[n]\n```\n",
    "tags": "dynamic_programming algorithms",
    "urgency": 7.49,
    "parent": "",
  },

  {
    "title": "Array Nesting",
    "description":
      "> A zero-indexed array `A` of length `N` contains all integers from `0` to `N-1`. Find and return the longest length of set `S`, where \\(S[i] = \\{A[i], A[A[i]], ... \\}\\). \\(S[i]\\) stops right before including a duplicate element.\n\n[spoiler]\n```python\ndef longest_nested_sequence(nums):\n    already_visited, ans = [False] * len(nums), 0\n    for i in range(len(nums)):\n        if not already_visited[i]:\n            j, current_length = i, 0\n            while not already_visited[nums[j]]:\n                current_length += 1\n                already_visited[nums[j]] = True\n                j = nums[j]\n            ans = current_length if current_length > ans else ans\n    return ans\n```",
    "tags": "arrays medium_programming_challenges connected_components",
    "urgency": 5.67,
    "parent": "",
  },

  {
    "title": "Longest Substring Without Repeating Characters",
    "description":
      "> Given a string \\(s\\), what's the length of the longest substring that has no duplicate characters?\n\n[spoiler]\nIntuition: Think of a sliding window. Drop chars off one end, while adding characters on the other.\n```python\ndef len_longest_substring_with_unique_chars(s):\n    len_s, i, j, len_longest_substr = len(s), 0, 0, 0\n    next_starting_i = {}\n\n    while j < len_s:\n        if s[j] in next_starting_i and next_starting_i[s[j]] > i: i = next_starting_i[s[j]]\n        len_substr = j - i + 1\n        if len_substr > len_longest_substr: len_longest_substr = len_substr\n        next_starting_i[s[j]] = j + 1\n        j += 1\n\n    return len_longest_substr\n```\n",
    "tags": "string_processing sliding_window medium_programming_challenges",
    "urgency": 6.7,
    "parent": "",
  },

  {
    "title": "The K'th Permutation Sequence",
    "description":
      "> Find the \\(k^{th}\\) sequence of the ordered list consisting of permutations of \\([1, 2, ..., n]\\)\n\n[spoiler]\n```python\ndef getPermutation(self, n: int, k: int) -> str:\n    group_size, kth_permutation = factorial(n), []\n    if k > group_size: return None\n    available_digits = list(range(1, n+1))\n\n    while n >= 1:\n        group_size = group_size / n\n        if k % group_size != 0: i = int(k / group_size)\n        else: i = int(k / group_size - 1)\n\n        kth_permutation.append(available_digits.pop(i))\n        n -= 1\n        k -= group_size * i\n\n    return \"\".join([str(x) for x in kth_permutation])\n```\n",
    "tags": "medium_programming_challenges",
    "urgency": 6.19,
    "parent": "",
  },

  {
    "title": "Convert Simple Roman Numerals into Integers",
    "description":
      "> The input is guaranteed to be in the range \\([1, 3999]\\)\n\n\n```python\ndef romanToInt(self, s):\n    roman_to_int = { \"I\": 1, \"V\": 5, \"X\": 10, \"L\": 50, \"C\": 100, \"D\": 500, \"M\": 1000 }       \n    decoded_num, num_literals, next_value = 0, len(s), -inf\n\n    for i, c in enumerate(s):\n        current_num = roman_to_int[c]\n        if i + 1 < num_literals and roman_to_int[s[i+1]] > current_num: decoded_num -= current_num\n        else: decoded_num += current_num     \n    return decoded_num\n\n```\n",
    "tags": "easy_programming_challenges string_processing",
    "urgency": 0,
    "parent": "",
  },

  {
    "title": "Trie Symbol Table",
    "description":
      "```java\npublic class TrieST<Value> {\n    private static int R = 256; // If you can use a small Alphabet, do so\n    private Node root;\n   \n    private static class Node { // Glorified linked list!\n        private Object val;\n        private Node[] next = new Node[R]; // Yikes!\n    }\n   \n    public Value get(String key) {\n        Node x = get(root, key, 0);\n        if (x == null) return null; return (Value) x.val;\n    }\n   \n    private Node get(Node x, String key, int d) {\n        if (x == null) return null; if (d == key.length()) return x;\n        char c = key.charAt(d); return get(x.next[c], key, d+1);\n    }\n   \n    public void put(String key, Value val)\n    {    root = put(root, key, val, 0); }\n   \n    private Node put(Node x, String key, Value val, int d) {\n        if (x == null) x = new Node();\n        if (d == key.length()) {x.val = val; return x; }\n        char c = key.charAt(d); x.next[c] = put(x.next[c], key, val, d+1);\n        return x;\n\n    }\n\n    public Iterable<String> keys() {    return keysWithPrefix(\"\"); }\n   \n    public Iterable<String> keysWithPrefix(String pre) {\n        Queue<String> q = new Queue<String>();\n        collect(get(root, pre, 0), pre, q); return q;\n    }\n  \n    private void collect(Node x, String pre, Queue<String> q) {\n        if (x == null) return; if (x.val != null) q.enqueue(pre);\n        for (char c = 0; c < R; c++) collect(x.next[c], pre+c, q);\n    }\n  \n    public Iterable<String> keysThatMatch(String pat) {\n        Queue<String> q = new Queue<String>();\n        collect(root, \"\", pat, q); return q;\n    }\n  \n    public void collect(Node x, String pre, String pat, Queue<String> q) {\n        if (x == null) return; int d = pre.length();\n        if (d == pat.length() && x.val != null) q.enqueue(pre);\n        if (d == pat.length()) return;\n        char next = pat.charAt(d);\n        for (char c = 0; c < R; c++) {\n            if (next == '.' || next == c) collect(x.next[c], pre+c, pat, q);\n        }\n    }\n  \n    public String longestPrefixOf(String s) {\n        return s.substring(0, search(root, s, 0, 0));\n    }\n  \n    private int search(Node x, String s, int d, int length) {\n        if (x == null) return length;\n        if (x.val != null) length = d; if (d == s.length()) return length;\n        char c = s.charAt(d); return search(x.next[c], s, d+1, length);\n    }\n  \n    public void delete(String key) {   root = delete(root, key, 0); }\n  \n    private Node delete(Node x, String key, int d) {\n        if (x == null) return null;\n        if (d == key.length() x.val = null;\n        else { char c = key.charAt(d); x.next[c] = delete(x.next[c], key, d+1);}\n        if (x.val != null) return x;\n        for (char c = 0; c < R; c++) if (x.next[c] != null) return x;\n        return null;\n    }\n}\n\n```\n\n## Properties\n\n* A set of keys uniquely describe a trie. The insertion/deletion order doesn't affect the trie's shape. In BSTs, order matters.\n* Searching/inserting a key in a trie takes at most 1 + (length of the key) array accesses. Search hits are optimal.\n* Search misses examine \\(\\approx lg_{R}N\\) nodes, assuming random keys. Search misses, while bound by key's length, don't depend on the key length.\n\n* The # of links range from \\(RN\\) (every key in the trie has a node that has its associated value and R links) to \\(RNw\\) if the first chars of all keys are different, where \\(w\\) is the average key length.\n* Code from [Algorithms, Sedgewick & Wayne](https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/TrieST.java.html)\n",
    "tags": "algorithms string_processing",
    "urgency": 6,
    "parent": "",
  },

  {
    "title": "Ternary Search Tries",
    "description":
      "```java\npublic class TST<Value> {\n    /* If we know the keys are uniformly distributed, we can have a table of R\n       TSTs, or even R^2 TSTs for the first 2 characters, instead of a single root. */\n    private Node root;\n\n    // Notice the explicit storage of keys unlike in R-way tries\n    private class Node { char c; Node left, mid, right; Value val; }\n  \n    public Value get(String key) // Same as for R-way tries\n  \n    private Node get(Node x, String key, int d) {\n        if (x == null) return null; char c = key.charAt(d);\n        if (c < x.c) return get(x.left, key, d);\n        else if (c > x.c) return get(x.right, key, d);\n        else if (d < key.length() - 1) return get(x.mid, key, d+1);\n        else return x;\n    }\n  \n    public void put(String key, Value val) // Same as for R-way tries\n  \n    private Node put(Node x, String key, Value val, int d) {\n        char c = key.charAt(d);\n        if (x == null) {x = new Node(); x.c = c; }\n        if (c < x.c) x.left = put(x.left, key, val, d);\n        else if (c > x.c) x.right = put(x.right, key, val, d);\n        else if (d < key.length() - 1) x.mid = put(x.mid, key, val, d+1);\n        else x.val = val; return x;\n    }\n}\n```\n### Remarks\n\n* The shape of a TST is influenced by order of insertions/deletions. Worst case, a node might become a singly linked list!\n* The number of links for \\(N\\) keys of average length \\(w\\) range from \\(3N\\) to \\(3Nw\\).\n* A search miss requires \\(\\approx ln(N)\\) character compares while a search hit or insertion uses a compare for each char in the key.\n* There's no need to specify an Alphabet. The TST will self-organize.\n\n* `delete()` requires a bit more work. Use the BST node deletion code to guide you.\n* Code adapted from [Sedgewick & Wayne, Algorithms](https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/TST.java.html)\n",
    "tags": "string_processing algorithms",
    "urgency": 5,
    "parent": "",
  },

  {
    "title": "Knuth-Morris-Pratt Substring Search",
    "description":
      "> \\(KMP\\), explain the big idea like I'm 5. What is it convenient for?\n\n\n\n[spoiler]\n\n\n\n* The KMP algorithm's insight is setting the pattern pointer on a mismatch such that the text pointer never gets decremented. This makes KMP suitable for searching for patterns in streams of undetermined length, *e.g. stdin*\n\n* The search accesses no more than \\(N + M\\) characters. The total run-time (and space) required to build a DFA is \\(\\approx MR\\)\n\n```java\npublic class KMP {\n    private String pat; private int[][]dfa;\n  \n    public KMP(String pat) {\n        this.pat = pat; int M = pat.length(); int R = 256;\n        dfa = new int[R][M]; dfa[pat.charAt(0)][0] = 1;\n        for (int X = 0, j = 1; j < M; j++) {\n            // Copy the mismatch cases from the restart case\n            for (int c = 0; c < R; c++) dfa[c][j] = dfa[c][X];\n            dfa[pat.charAt(j)][j] = j+1; // Set the match case to advance\n            X = dfa[pat.charAt(j)][X]; // Update the restart case\n        }\n    }\n  \n    public int search(String txt) {\n        int i, j, N = txt.length(), M = pat.length();\n        for (int i = 0, j = 0; i < N && j < M; i++) j = dfa[txt.charAt(i)][j];\n        if (j == M) return i - M;\n        else return N;\n    }\n}\n\n```\n\n* Code adapted from [Algorithms, Sedgewick & Wayne](https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/KMP.java.html)\n",
    "tags": "string_processing algorithms",
    "urgency": 6.11,
    "parent": "",
  },

  {
    "title": "Top-Down DP: Rod Cutting Problem",
    "description":
      "> Given a rod of length `n` inches and a table of prices `p_i` for `i = 1, 2, ..., n`, determine the maximum revenue `r_n` obtainable by cutting up the rod and selling the pieces using a top-down approach.\n\n\n[spoiler]\n\n\n* The decomposition: *Cut a piece of length \\(i\\) from the left side. Only decompose the remaining piece of length \\(n-i\\)*\n```python\ndef memoized_cut_rod(p, n):\n    r = [math.inf * -1] * (n + 1)\n    return memoized_cut_rod_aux(p, n, r)\n\ndef memoized_cut_rod_aux(p, n, r):\n    if r[n] >= 0: return r[n]\n    if n == 0:\n        q = 0\n    else:\n        q = math.inf * -1\n        for i in range(1, n+1):\n            q = max(q, p[i] + memoized_cut_rod_aux(p, n-i, r))\n    r[n] = q\n    return q\n```\n",
    "tags": "dynamic_programming algorithms programming_challenges",
    "urgency": 7,
    "parent": "",
  },

  {
    "title": "Top-Down DP: The Rod Cutting Problem",
    "description":
      "> Given a rod of length \\(n\\) inches and a table of prices \\(p_i\\) for \\(i = 1, 2, ..., n\\), determine the maximum revenue \\(r_n\\) obtainable by cutting up the rod and selling the pieces. Solve this using a top-down approach.\n\n\n[spoiler]\n* The decomposition: *Cut a piece of length \\(i\\) from the left side. Only decompose the remaining piece of length \\(n - i\\)*\n```python\ndef memoized_cut_rod(p, n):\n    r = [-inf] * (n + 1)\n    return memoized_cut_rod_aux(p, n, r)\n\ndef memoized_cut_rod_aux(p, rod_length, r):\n    if r[rod_length] >= 0: return r[rod_length]\n    if rod_length == 0: q = 0\n    else:\n        q = -inf\n        for i in range(1, rod_length+1):\n            q = max(q, p[i] + memoized_cut_rod_aux(p, rod_length-i, r))\n    r[rod_length] = q\n    return q\n```\n",
    "tags":
      "dynamic_programming algorithms medium_programming_challenges recursive_algorithms",
    "urgency": 6.92,
    "parent": "",
  },

  {
    "title": "Reconstructing a Solution in DP: Rod Cutting",
    "description":
      "How do you reconstruct a solution in DP? Demonstrate this using the rod cutting problem.\n\n[spoiler]\nStore the value computed for each sub-problem AND the choice that led to the optimal value.\n\n```\nlet r[0 .. n] and s[0 .. n] be new arrays\nr[0] = 0\nfor j = 1 to n {\n    q = -infinity\n    for i = 1 to j {\n        if (q < p[i] + r[j-i]) {\n            q = p[i] + r[j-i]; s[j] = i\n        }\n    r[j] = q\n}\nreturn (r, s)\n```\nWe can then reconstruct the solution as follows. Note that we never stored the complete result explicitly.\n```\n(r, s) = extended_bottom_up_cut_rod(p, n)\nwhile (n > 0) {\n    print s[n]\n    n = n - s[n]\n}\n```\n",
    "tags": "dynamic_programming algorithms",
    "urgency": 7.57,
    "parent": "",
  },

  {
    "title": "The 2 Elements of Dynamic Programming",
    "description":
      "* When does a problem have an optimal sub-structure? How do you systematically determine this?\n* What are the tradeoffs between bottom up and top down DP approaches?\n\n\n[spoiler]\n\n\n### Optimal Sub-Structure\nDiscovering optimal sub-structure usually follows this pattern:\n\n1. Notice that a solution to the problem consists of making a choice, and making this choice leaves some sub-problems to be solved, e.g. *in rod-cutting, choosing the initial cut - but we have \\(n-1\\) possible choices that need to be explored*\n1. Given a choice, characterize the resulting space of sub-problems. Keep the space as simple as needed, e.g. *in rod-cutting, the problems of optimally cutting up a rod of length \\(i\\) for each \\(i\\)*.\n1. Show that solutions to sub-problems used within an optimal solution must themselves be optimal using a 'cut-and-paste' technique.\n\nThe sub-problems must be independent, e.g. *in finding longest simple paths from \\(u \\rightarrow v\\), we can't use DP to solve for \\(u \\rightarrow w \\) and \\(w \\rightarrow v\\) since except \\(w\\), any vertex used in \\(u \\rightarrow w \\) cannot be used for \\(w \\rightarrow v\\) if we're to keep the path simple.*\n\n### Overlapping Sub-Problems\n\n* Although the solution space is \\(\\approx 2^n\\), the number of distinct sub-problems must be polynomial-n.\n* We can benefit from memoizing the natural but inefficient recursive algorithm.\n* Alternatively, we can go bottom-up up by solving all prerequisite sub-problems before getting to a given sub-problem.\n* To reconstruct the optimal solution, store the choice made in each sub-problem.\n* Although top-down avoids solving unnecessary sub-problems, bottom-up has less recursion and table overhead, and can exploit locality when accessing table entries.\n",
    "tags": "dynamic_programming algorithms",
    "urgency": 6.43,
    "parent": "",
  },

  {
    "title": "The Usefulness of Useless Knowledge",
    "description":
      "### [Abraham Flexner, The Usefulness of Useless Knowledge](https://1drv.ms/b/s!AvGG5UqSCqXTniYJPySnZ1Cat90F)\n\n* Marconi was inevitable. Maxwell carried out certain abstruse and remote calculations in EM. Heinrich Hertz solved the detection and demonstration of EM waves. Marconi, a clever technician, seized upon Maxwell's and Hertz' useless theoretical work.\n\n* At no point of his unmatched career was Faraday interested in utility. He was absorbed in disentangling the riddles of the universe, at first chemical riddles, in later periods, physical riddles.\n\n* The folly of poisoned men, not the intention of the scientists, is responsible for the destructive use of the agents employed in modern warfare.\n\n* To be sure, we shall thus waste some precious dollars. But what is infinitely more important is that we shall be striking the shackles off the human mind.\n",
    "tags": "articles education c13u_diaries",
    "urgency": 3.3,
    "parent": "",
  },

  {
    "title": "Finding Maximum and Minimum at the Same Time",
    "description":
      "> Find the minimum and the maximum in an array while using at most \\(3 \\times floor(\\frac{n}{2})\\) comparisons, where \\(n\\) is the length of the array.\n\n\nWhat is the optimal number of comparisons for finding either the min (or the max)?\n\n\n[spoiler]\n* Significant improvement over \\(2n-2\\) comparisons for finding max and min using a tournament style knockout.\n* Note that \\(n-1\\) comparisons is optimal for finding either the min or the max.\n\n```python\nn = len(array)\nif n == 0:\n    raise ValueError(\"min and max for empty sequences are not defined\")\nelif n % 2 == 0:\n    if array[0] > array[1]: minimum, maximum = array[1], array[0]\n    else: minimum, maximum = array[0], array[1]\n    i = 2\nelse:\n    minimum, maximum = array[0], array[0]\n    i = 1\n\nwhile (i <= n - 2):\n    if array[i] < array[i+1]:\n        if array[i] < minimum: minimum = array[i]\n        if array[i+1] > maximum: maximum = array[i+1]\n    else:\n        if array[i] > maximum: maximum = array[i]\n        if array[i+1] < minimum: minimum = array[i+1]\n    i += 2\n\nreturn minimum, maximum\n```\n",
    "tags": "algorithms searching",
    "urgency": 6.7,
    "parent": "",
  },

  {
    "title": "Binary Search Tree Traversal",
    "description":
      "* Walking a tree (in-order, pre-order, or post-order) takes \\(O(n)\\) time since the procedures calls itself recursively exactly twice for each node in the tree.\n* In-order traversal prints the root between printing the left subtree and the right subtree, yielding a sorted sequence.\n```\nvoid in_order_tree_walk(x) {\n    if (x != null) {\n        in_order_tree_walk(x.left);\n        print(x.key);\n        in_order_tree_walk(x.right);\n    }\n}\n\n```\n* A pre-order traversal prints the root before the values in either subtree.\n* A post-order traversal prints the root after the values in its subtrees.\n",
    "tags": "data_structures binary_trees binary_search_trees",
    "urgency": 5.6,
    "parent": "",
  },

  {
    "title": "Searching a Binary Search Tree",
    "description":
      "* What property do all binary search trees have? What is the consequence of this property?\n* How would you implement a method that searches for an item in a BST? What trade-offs are there between different approaches?\n\n[spoiler]\nThe keys in a BST satisfy the BST property:\n* For any node \\(x\\), the keys in the left subtree of \\(x\\) are at most \\(x.key\\), and the keys in the right subtree of \\(x\\) are at least \\(x.key\\).\n* Searching for a key takes \\(O(h)\\), where \\(h\\) is the height of the BST.\n```\nvoid tree_search_recursive(x, k) {\n    if (x == null || k == x.key) return x;\n    if (k < x.key) return tree_search_recursive(x.left, k);\n    else return tree_search_recursive(x.right, k);\n}\n// Iteration is usually more efficient, but less straightforward. But compilers optimize tail recursion...\nnode tree_search_iterative(x, k) {\n    while (x != null && x.key != k) {\n        if (k < x.key) x = x.left;\n        else x = x.right;\n    }\n    return x;\n}\n```\n\n",
    "tags": "data_structures binary_search binary_search_trees",
    "urgency": 6.4,
    "parent": "",
  },

  {
    "title": "Inserting a Node into a Binary Search Tree",
    "description":
      "> Insert a node into a binary search tree. Between inserting and deleting a node, which one is more straightforward? Why?\n\n\n[spoiler]\n```\nvoid tree_insert(T, z) {\n    y = null, x = T.root;\n    while (x != null) {\n        y = x; // We need a trailing pointer because when the search concludes, x will be useless\n        if (z.key < x.key) x = x.left;\n        else x = x.right;\n    }\n    z.parent = y;\n    if (y == null) T.root = z;\n    else if (z.key < y.key) y.left = z;\n    else y.right = z;\n}\n```\n",
    "tags": "trees data_structures",
    "urgency": 6.8,
    "parent": "",
  },

  {
    "title": "Deleting a Node from a Binary Search Tree",
    "description":
      "Describe how to delete a node from a BST such that the BST properties still hold.\n\n\n\n[spoiler]\n\n\n```c\n// Replace the subtree rooted at u with the subtree rooted at v\nvoid tree_transplant(T, u, v) {\n    if (u.parent == null) T.root = v;\n    else if (u == u.parent.left) u.parent.left = v;\n    else u.parent.right = v;\n    if (v != null) v.parent = u.parent;\n}\n\nvoid tree_delete(T, z) {\n    if (z.left == null) tree_transplant(T, z, z.right); // Replace z with its right child\n    else if (z.right == null) transplant(T, z, z.left); // Replace z with its left child\n    else { // ... z has a left child and a right child... \n        successor = tree_minimum(z.right); // Recall that successor has no left child\n        // We want the successor to take z's place in the tree...\n        if (successor.parent != z) {\n            // Replace successor as a child of its parent with the successor's right child\n            tree_transplant(T, successor, successor.right); \n            successor.right = z.right; // Turn z's right child into successor's right child\n            successor.right.parent = successor; // inform the child of its new Mommy\n        } \n        transplant(T, z, successor); // ... replace z as a child of its parent with its successor\n        successor.left = z.left; // ... successor.left was null, but now has z's left subtree...\n        successor.left.parent = successor; // ... inform the left child of its new Daddy \n    }\n}\n```\n",
    "tags": "trees data_structures",
    "urgency": 7.4,
    "parent": "",
  },

  {
    "title": "Selecting a Node with a Given Rank in a BST",
    "description":
      "* What modification needs to be made to a BST so that it can support rank-related queries?\n* Describe an algorithm for getting the node with the \\(i^{th}\\) smallest key in the subtree rooted at \\(x\\).\n\n[spoiler]\n* An order-statistic tree is a red-black tree with an additional \\(x.size\\) attribute in each node.\n* The tree has the identity \\(x.size = x.left.size + x.right.size + 1\\)\n* We can maintain the size attribute while still inserting and deleting nodes in \\(O(lg (N))\\) time.\n* If we chose to add \\(x.rank\\), `select()` and `rank()` would be fast, but inserting a minimum node would take \\(O(N)\\) time. Not great!\n\n```c\nnode select(x, i) {\n    r = x.left.size + 1;\n    if (i == r) return x;\n    else if (i < r) return select(x.left, i);\n    else return select(x.right, i-r);\n}\n```\n",
    "tags": "data_structures binary_search_trees order_statistics",
    "urgency": 6.2,
    "parent": "",
  },

  {
    "title": "Augmenting RB-Trees to Support Interval Search",
    "description":
      "Augment a BST such that you can search for all items within a given interval. Why are we using a BST for this?\n\n\n\n[spoiler]\n* Each node \\(x\\) has `x.int` which has `x.int.low` (acts as the key) and `x.int.high`.\n* Additionally, each node \\(x\\) has `x.max` which is the maximum value of any interval endpoint stored in the subtree rooted at \\(x\\).\n* We can support `x.max = max(x.int.high, x.left.max, x.right.max)` in \\(O(1)\\), so we're good!\n\n```c\nnode interval_search(T, i) {\n    x = T.root;\n    while (x != T.nil && no_overlap(x.int, i)) {\n        if (x.left != T.nil && x.left.max >= i.low)  x = x.left;\n        else x = x.right;\n    }\n    return x;\n}\n```\n# Correctness Check\n* If the search goes right, we're sure that no interval in the left subtree would have overlapped with \\(i\\)\n* If the search goes left, and there's overlap, we're done.\n* Otherwise we're sure that \\(x\\)'s left subtree contains an \\(i_l\\) s.t \\(i_{l}.high = x.left.max\\). Since \\(i\\) doesn't overlap \\(i_{l}\\), neither does it overlap any interval \\(i_{r}\\) in \\(x\\)'s right subtree because \\(i_{r}, i_{l}.low \\le i_{r}.low\\)\n",
    "tags": "data_structures binary_search binary_search_trees",
    "urgency": 6.6,
    "parent": "",
  },

  {
    "title": "Parks and Rec Quotes",
    "description":
      "**S6E06**\n\n* Nadia, the super hot doctor, has been hanging out with me for the past week. She is definitely out of my league. Actually, we're not even playing the same sport!\n\n* [Can I just say, I love your hair.] Thank you, it's genetic and unattainable.\n* [The only thing that's important at the end of the day is what is on your gravestone. Your name.] My gravestone is going to be a 60-inch touchscreen with a hologram of me singing End of the Road by Boys II Men. But point taken.\n\n**S6E07**\n\n\n* [Wsup girl?] Keep walking 98. [You didn't want to talk to that guy? He plays in the NFL.] He's a line backer. Skilled positions only for Donna Meagle.\n\n\n**S6E12**\n\n* I am back at the Parks Department, and Ben is City Manager, but we're married, so it's kosher and awesome.\n",
    "tags": "tv_quotes parks_and_rec",
    "urgency": 2,
    "parent": "",
  },

  {
    "title": "Of Private, Public and Common Knowledge",
    "description":
      "On the Island of the Green-Eyed Tribe, if you have blue eyes you must get in your canoe and leave the island the next morning. But there are no mirrors or reflective surfaces on the island, so you don’t know the color of your own eyes. It is also taboo to talk with each other about eye color, so when you see a fellow tribesman with blue eyes, you say nothing. As a result, even though everyone knows there are blue-eyed tribesmen, no one has ever left the island for this taboo.\n\n\n\nA Missionary comes to the island and announces to everyone, “At least one of you has blue eyes.\" For any \\(n\\) tribesmen with blue eyes, they all leave simultaneously on the \\(n^{th}\\)morning after the Missionary’s statement.\n\nThe Missionary transforms everyone’s private information into common knowledge. Common knowledge is information, public or private, that everyone believes is shared by everyone else.\n",
    "tags": "fiction short_story c13u_diaries",
    "urgency": 4.1,
    "parent": "",
  },

  {
    "title": "Edit Distance by Recursion",
    "description":
      "You can also find the edit distance between two strings by recursion. How would you do it? Where is the repeated work?\n\n\n\n* Note: Please revisit the comments on the 3 options explored....\n\n\n[spoiler]\n\n```python\ndef brute_edit_distance(p, t, i, j):\n   \n    # Assumes that the pattern & target both have a single-space left padding\n    if i == 0: return j * indel_cost(\" \")\n    if j == 0: return i * indel_cost(\" \")\n      \n    return min(\n        # Option 1/3: Match the pattern's i'th char to the target's j'th char...\n        brute_edit_distance(p, t, i-1, j-1) + match_cost(p[i], t[j]),\n        # Option 2/3: Delete a character from the pattern\n        brute_edit_distance(p, t, i, j-1) + indel_cost(t[j]),\n        # Option 3/3: Insert a new matching character into the pattern\n        brute_edit_distance(p, t, i-1, j) + indel_cost(p[i])\n    )\n```\n* Note that there can only be \\(|p| \\cdot |t|\\) unique recursive calls.\n* If we store the values for each of these `(i, j)` pairs, we can avoid recomputing them.",
    "tags": "string_processing algorithms edit_distance",
    "urgency": 6.59,
    "parent": "",
  },

  {
    "title": "Edit Distance by Dynamic Programming",
    "description":
      "> What is the minimum number of changes needed to convert string \\(s\\) to string \\(t\\)?\n\n[spoiler]\n* Let \\(m[i][j]\\) be the minimum number of differences between \\(s_1, s_2, ..., s_i\\) and the segment of the target \\(t\\) ending at \\(j\\)\n```c\ntypedef struct { int cost; int parent; } cell;\ncell m[MAXLEN+1][MAXLEN+1];\n\nint string_compare(char *s, char *t) {\n    int i, j, k; int opt[3];     /* counters; cost of the three options */\n    for (i = 0; i < MAXLEN; i++) { row_init(i); column_init(i); }\n    for (i=1; i < strlen(s); i++) {\n        for (j=1; j < strlen(t); j++) {\n            opt[MATCH] = m[i-1][j-1].cost + match(s[i], t[j]);\n            opt[INSERT] = m[i][j-1].cost + indel(t[j]);\n            opt[DELETE] = m[i-1][j].cost + indel(s[i]);\n            m[i][j].cost = opt[MATCH]; m[i][j].parent = MATCH;\n            for (k = INSERT; k <= DELETE; k++) {\n                if (opt[k] < m[i][j].cost) { m[i][j].cost = opt[k]; m[i][j].parent = k; }\n            }\n        }\n    }\n    goal_cell(s, t, &i, &j);\n    return m[i][j].cost;\n}\n\n```",
    "tags":
      "dynamic_programming algorithms string_processing hard_programming_challenges edit_distance",
    "urgency": 8.24,
    "parent": "",
  },

  {
    "title": "Special Cases of Edit Distance",
    "description":
      "What modifications are needed to the edit distance problem so that we can:\n* Search for a word and its misspellings within a larger text?\n* Find the longest common subsequence between two strings?\n* Find the maximum monotone sequence, *e.g. the longest increasing subsequence*?\n\n\n\n[spoiler]\n\n\n# Fuzzy Substring Matching\n* e.g. searching for \"Skiena\" in all its misspellings \"Skienna\", \"Skena\", ... within a long file.\n\n```c\nrow_init(int i) {\n    m[0][i].cost = 0;            /* Was previously i, for the cost of of indels */\n    m[0][i].parent = -1;       /* It was previously set to INSERT. -1 only was used for i == 0. */\n}\ngoal_cell(char *s, char *t, int *i, int *j) {\n    int k;\n    *i = strlen(s) - 1; /* Because we definitely want the whole pattern */\n    for (k=1; k < strlen(t); k++) { if (m[*i][k].cost < m[*i][*j].cost) *j = k; }\n}\n```\n\n# Longest Common Subsequence\n* e.g. `LCS(\"democrat\", \"republican\")` is `\"eca\"`.\n* We need to prevent substitutions.\n* Making the substitution penalty greater than the sum of an insertion plus a deletion will do the trick!\n\n\n# Maximum Monotone Sequence\n\n* e.g. `longest_increasing_subsequence(\"243517698\")` is \"23568\".\n* Note that this reduces to `LCS(\"243517698\", \"123456789\")`. Neat!\n* If we want the longest decreasing sequence, then have the target as the reversed sort order of the elements.\n",
    "tags":
      "dynamic_programming algorithms string_processing reduction edit_distance subsequence_algorithms",
    "urgency": 7.02,
    "parent": "",
  },

  {
    "title": "Reconstructing the Path in Edit Distance",
    "description":
      "* Walking backwards from the goal state and following the parent pointer reconstructs the solution in reverse order.\n* Clever use of recursion can do the reversing for us.\n```c\nreconstruct_path(char *s, char *t, int i, int j) {\n    if (m[i][j].parent == -1) {\n        return;\n    } else if (m[i][j].parent == MATCH) {\n        reconstruct_path(s, t, i-1, j-1); match_out(s, t, i, j); return;\n    } else if (m[i][j].parent == INSERT) {\n        reconstruct_path(s, t, i, j-1); insert_out(t, j); return;\n    } else if (m[i][j].parent == DELETE) {\n        reconstruct_path(s, t, i-1, j); delete_out(s, i); return;\n    }\n}\n```\n* Note that the parent field isn't explicitly needed. You can work backward from the costs of the 3 possible ancestor cells.\n",
    "tags": "dynamic_programming algorithms string_processing edit_distance",
    "urgency": 6.05,
    "parent": "",
  },

  {
    "title": "Greatest Subarray Product",
    "description":
      "* What is the greatest product of \\(K\\) consecutive digits in a given \\(N\\)- digit number? What about \\(K\\) adjacent numbers in an \\(M \\times N\\) grid?\n* What is the greatest product that can be formed from a subarray (including the whole array)?\n\n[spoiler]\n\n* To avoid repeated work, you want to compute the product of your \\(K\\)-sliding window by dividing by the leftmost element, and multiplying by the one after the rightmost.\n* There are special cases. Zeros and negative numbers would affect all subsequent products.\n* The greatest product of \\(K\\) adjacent numbers in an \\(M \\times N\\) grid can be reduced to the previous one by generating appropriate arrays from the grid.\n\n## What is the greatest product that can be formed from a subarray (including the whole array)?\n\n* This is a generalization of the \\(K\\)-consecutive digits problem.\n* Notice that once you read a zero, you need to extract the maximum product so far and reset your variables.\n* So scan the array L-R. Keep track of the current product and the most recent +ve product.\n* If you read a zero, compare your most recent +ve product with your best answer, update if need be.\n* Instead of pointer gymnastics, repeat steps #2 and #3 with the numbers in reverse order.\n",
    "tags":
      "arrays algorithms medium_programming_challenges array_contiguous_elements sliding_window",
    "urgency": 5.79,
    "parent": "",
  },

  {
    "title": "What is the first triangular number to have over N divisors?",
    "description":
      "Triangular numbers are generated by adding natural numbers, e.g. 7th triangular number is \\( 1 + 2 + 3 + 4 + 5 + 6 + 7 = 28\\).\n\nThe problem boils down to how fast we can count the factors of a number \\(X\\).\n\n\n* Incrementally checking factors up to \\(\\sqrt{X}\\) is not fast enough.\n\n\n* If we look for \\(2^n \\times 3^m \\times 5^q \\times ...\\), we'll get through the number faster.\n\n\n* From [divisor properties](https://en.wikipedia.org/wiki/Divisor_function#Formulas_at_prime_powers), if the prime factorization of a number is \\(a^n \\times b^m \\times c^q\\), the number has \\((n+1)(m+1)(q+1)\\) divisors.\n\n\nBottom line, be on the lookout for quantities that might obey a mathematical formula. Non-recursive formulas are efficient.\n",
    "tags": "mathematics algorithms primes hard_programming_challenges",
    "urgency": 4.27,
    "parent": "",
  },

  {
    "title": "Projecting Parallel Segments Onto a Single Line",
    "description":
      "> Given a set of intervals, find the non-overlapping sections.\n\n\n\n[spoiler]\n\nWhen answering a search problem, sort unless the initial order matters. Sorting gives you an invariant that you can use in lieu of extra computation.\n\n1. In this case, sort the line segments by the left endpoint, then the right endpoint.\n\n2. Then start moving from L-R. Fix the left endpoint. If you find a segment whose left end overlaps the current endpoint, 'absorb' this segment and update the right endpoint if need be.\n\n3. If you find a segment \\((x_1, x_2)\\) whose left endpoint is greater than your composite right endpoint, then you know you've found an empty interval. All the other segments to come must lie to the right of \\((x_1, x_2)\\).\n\n4. Repeat steps #2 and #3 till you're out of segments.\n\n[Source](https://github.com/dchege711/better_programmer/tree/chege_solutions/arrays/gridland_metro)\n",
    "tags": "algorithms medium_programming_challenges",
    "urgency": 5.1,
    "parent": "",
  },

  {
    "title": "Smallest Non-Negative Difference in Array Element Pairs",
    "description":
      "> Given an array of numbers, whats the smallest non-negative \\(x_j - x_k\\) such that \\(j < k\\)? e.g. for \\([20, 7, 8, 2, 5]\\), the answer is \\(2\\) because of \\(\\ 7 - 5\\)\n\n\n\n[spoiler]\n\nIf we don't sort, getting the smallest non-negative difference will take quadratic time.\n\nIf we were to sort, it'd take us linear time to find the smallest non-negative difference. But we'd need to know whether there exists indices \\(j, k\\) such that \\(j < k\\)\n\nLet's compromise by using extra linear space. For each unique number, let's store the first index at which the number exists. We can then use this update rule in our algorithm:\n\n```python\ndiff = x_j - x_i # Where x_j guaranteed to be >= x_i because of the sorting\nif diff < smallest_non_negative_diff and earliest_pos[x_j] < earliest_pos[x_i]:\n    smallest_non_negative_diff = diff\n```\n",
    "tags":
      "algorithms medium_programming_challenges arrays array_search_under_constraints",
    "urgency": 4.01,
    "parent": "",
  },

  {
    "title": "Find Median from Data Stream",
    "description":
      "* If the array were fixed, we could sort it then pick the middle value.\n* But a stream is unsorted. To maintain a sorted order, think of binary search trees and its variants.\n* A BST can give us the \\(i^{th}\\) element in \\(O(log\\ n)\\) time.\n* However, we're asking for a specific \\(i\\) - the median. We can do \\(O(1)\\).\n\n## Algorithm\n\n* Set up two PQs. The left PQ should be max-oriented, while the right PQ should be min-oriented.\n* Choose an invariant, e.g. if the number of items is odd, the right PQ will have one more item; otherwise, the PQs will have the same # of items.\n* When inserting an item, if it's less than the max of the left PQ, then add it to the left PQ. Otherwise add it to the right PQ. After insertions, do some data movements to ensure the invariant in step 2 is maintained.\n* If asked for the median, use the invariant in step 2 to provide the median in \\(O(1)\\) time.\n",
    "tags": "algorithms hard_programming_challenges",
    "urgency": 4.75,
    "parent": "",
  },

  {
    "title": "Chapter I: Imposed Social Stratification",
    "description":
      "* One egg, one embryo, one adult-normality. But a bokanovskified egg will bud, will proliferate, will divide. Making 96 human beings grow where only one grew before. Progress.\n* Bokanovsky's Process is one of the major instruments of social stability! Standard men and women, in uniform batches. The whole of a small factory staffed with the products of a single bokanovskified egg.\n* So we allow as many as 30% of the female embryos to develop normally. The others get a dose of male sex-hormone every 24m for the rest of the course. Result: they're decanted as freemartins - structurally quite normal, except the slightest tendency to grow beards, but sterile. Guaranteed sterile.\n* We also predestine and condition. We decant our babies as socialized human beings, as Alphas or Epsilons, as future sewage workers or future ... Hasn't it occurred to you that an Epsilon embryo must have an Epsilon environment as well as an Epsilon heredity?\n* But in Epsilons, we don't need human intelligence. Didn't need it, didn't get it. But though the Epsilon mind was mature at ten, the Epsilon body was not fit to work till eighteen. Long years of superfluous and wasted immaturity.\n* Heat conditioning. Hot tunnels alternated with cold tunnels. Coolness was wedded to discomfort in the form of hard X-rays. By the time they were decanted, the embryos had a horror of cold. They were predestined to emigrate to the tropics, to be miner and acetate milk spinners and steel workers... And that is the secret of happiness and virtue - liking what you've got to do.\n",
    "tags": "brave_new_world fiction books dystopia c13u_diaries",
    "urgency": 5.4,
    "parent": "",
  },

  {
    "title": "Brave New World: Chapter II",
    "description":
      "* Observe. Books, and loud noises, flowers and electric shocks - already in the infant mind were compromisingly linked. You couldn't have lower-caste people wasting the Community's time over books, and there was always the risk of reading something which might undesirably de-condition one of their reflexes.\n\n\n* A love of nature keeps no factories busy. We condition the masses to hate the country, but simultaneously condition them to love all country sports. At the same time, we see to it that all country sports shall entail the use of elaborate apparatus. So that they consume manufactured articles as well as transport.\n\n\n> <em>Alpha children wear grey. They work much harder than we do, because they are so frightfully clever. I'm really awfully glad I'm a Beta, because I don't work so hard. And then we are much better than the Gammas and Deltas. Gammas are stupid. They all wear green, and Delta children wear khaki. Oh no, I don't want to play with Delta children. And Epsilons are still worse. They're too stupid to be able to read or write. Besides, they wear black, which is such a beastly color. I'm so glad I'm a Beta </em>\n\n\n* Hyponopaedia. Till at last the child's mind is these suggestions, and the sum of the suggestions is the child's mind. And not the child's mind only. The adult's mind too - all his life long. But these suggestions are our suggestions. Suggestions from the State. It therefore follows ...\n",
    "tags": "brave_new_world fiction books c13u_diaries",
    "urgency": 5.6,
    "parent": "",
  },

  {
    "title": "Reading into Politics Embedded in Language",
    "description":
      "> The language becomes ugly and inaccurate because our thoughts are foolish, but the slovenliness of our language makes it easy for us to have foolish thoughts.\n\n* Passive voice and euphemisms (e.g. pacification, border control) to obscure reality.\n* Illusory experiences by using ill-defined words such as democracy, fascism.\n\n* Pretentious diction to appear profound, scientifically impartial or dignified.\n\n\n[Original OneNote Page](https://onedrive.live.com/view.aspx?resid=D3A50A924AE586F1%213393&id=documents&wd=target%28People%20Affairs.one%7CCA824F5B-F059-9C4F-8DC8-9970F99A945D%2FPolitics%20and%20Language%7C304ED131-B85D-D448-AD3C-79AE19683F98%2F%29onenote:https://d.docs.live.net/d3a50a924ae586f1/Documents/c13u%20Diaries/People%20Affairs.one#Politics%20and%20Language&section-id={CA824F5B-F059-9C4F-8DC8-9970F99A945D}&page-id={304ED131-B85D-D448-AD3C-79AE19683F98}&end)",
    "tags": "politics language rhetoric c13u_diaries",
    "urgency": 4.7,
    "parent": "",
  },

  {
    "title": "Making Sense of Irrational Politics",
    "description":
      "> Politics is the mind killer. Arguments are soldiers. Once you know which side you're on, you must support all arguments of that side, and attack all the arguments that appear to favor the enemy side; otherwise it's like stabbing your soldiers in the back. Furthermore, any soldier on one side can be used to fight any soldier on the other side.\n\n\n* Dealing w/ cognitive dissonance requires changing one's view of the facts (e.g. just world fallacy) or changing one's morality.\n* Subjective impressions of goodness act as a falliable heuristic, e.g. \"a reactor design that produces less waste has a lower probability of meltdown\".\n\n* Are enemies innately evil? \"Die, vicious scum!\" is a more inspiring battle cry than \"Die, people who could have been just like me but grew up in a different environment!\"\n* Argument screens authority. Hug the query if you can. Judging Wright Bros by their authority < Looking at their calculations < Watching the actual plane fly.\n",
    "tags": "politics rhetoric c13u_diaries",
    "urgency": 5.8,
    "parent": "",
  },

  {
    "title": "Constructing a Palindrome",
    "description":
      "> Return the largest palindromic number that can be made by changing no more than \\(k\\) digits, or return -1 if it's impossible.\n\n\n\n[spoiler]\n\n* On the first pass, make the number a palindrome by matching the lesser of complementary digits.\n* If you had to make more than \\(k\\) changes in step 1, then return -1 because the task is impossible.\n* Otherwise, proceed from L-R swapping pairs that are not 9's with 9's. This order maximizes the palindrome. Remember to keep track of the total number of changes made.\n* Lastly, if you have at least one more change left and there's a middle digit that's not paired up, change it into a 9.\n",
    "tags": "string_processing medium_programming_challenges",
    "urgency": 4.14,
    "parent": "",
  },

  {
    "title": "Edit Distance Between Two Arrays in Quadratic Time",
    "description":
      "> Is it possible to remove at most one char from a string \\(s\\) such that \\(s'\\) has all its remaining chars appearing the same number of times?\n\n\n\n[spoiler]\n\nNotice it's an array question, i.e. what's the cost of either zeroing out, or matching up the different elements in an array of frequencies? e.g. \\([1, 2, 2, 2] \\rightarrow [1, 1, 1, 1]\\) costs \\(-3\\), while \\([1, 2, 2, 2] \\rightarrow [2, 2, 2]\\) costs \\(-1\\).\n\n```python\nfor target_value in frequency_counts.keys():\n    cost_of_transformation = 0\n    for other_value in frequency_counts.keys():\n        cost_of_matching = frequency_counts[other_value] * (target_value - other_value)\n        cost_of_zeroing = frequency_counts[other_value] * other_value * -1\n        if cost_of_matching > 0: delta = cost_of_zeroing # Otherwise, we'd be adding new elements...\n        else: delta = max(cost_of_matching, cost_of_zeroing) # The 'smaller' -ve number\n        cost_of_transformation += delta\n        if cost_of_transformation < -1: break\n    if cost_of_transformation == -1 or cost_of_transformation == 0: return True\nreturn False\n```\n",
    "tags":
      "algorithms medium_programming_challenges array_transformations arrays edit_distance",
    "urgency": 6.74,
    "parent": "",
  },

  {
    "title": "Navigating a Graph Under Constraints",
    "description":
      "> Q: What is the minimum number of moves that a knight can take to go from position \\((0,0)\\) to \\((n-1, n-1)\\) ?\n\n\n\n[spoiler]\n\n* Note that the constraints on the knight's movements only affect which nodes (representing grid positions) will be connected, i.e. the algorithm will be the same, except for the \\(node.get\\_neighbors()\\) function.\n\n* The question thus reduces to a BFS from the \\((0, 0)\\) to \\((n-1, n-1)\\) on a graph with the appropriate connections.\n\n",
    "tags":
      "algorithms medium_programming_challenges graph_algorithms breadth_first_search",
    "urgency": 3.7,
    "parent": "",
  },

  {
    "title": "Minimum Genetic Mutation",
    "description":
      "> Q: Given a gene `bank`, a `start` and an `end`, what is the minimum number of mutations needed to mutate from `start` to `end`? One mutation is defined as one single character changed in the gene string.\n\n[spoiler]\n\n* I'll need to run a BFS from `start` and hope that I can make it to `end`. I'll create the graph using a lazy approach.\n* Generating the 1-edit away neighbors of a given string is \\(O(n)\\) - unless I reduce the search space in each iteration. After all, if I see a gene string once, I don't want to visit it again.\n\n```python\nqueue.put(start_string)\ndistance = 1\nwhile not queue.empty():\n    nodes_to_process = []\n    while not queue.empty(): nodes_to_process.append(queue.get())\n    next_nodes = set()\n    for node in nodes_to_process:\n        for possible_next_node in bank:\n            if edit_distance_equals_one(node, possible_next_node):\n                next_nodes.add(possible_next_node)\n        if end_string in next_nodes: return distance\n        for next_node in next_nodes:\n            queue.put(next_node)\n            if next_node in bank: bank.remove(next_node)\n    distance += 1\nreturn -1\n```\n\n",
    "tags":
      "string_processing medium_programming_challenges breadth_first_search graph_algorithms edit_distance",
    "urgency": 5.15,
    "parent": "",
  },

  {
    "title": "Longest Fibonacci-Like Subsequence",
    "description":
      "> Given a strictly increasing array \\(A\\) of positive integers forming a sequence, find the length of the longest fibonacci-like subsequence of \\(A\\)\n\n\n\n* [Practice on LeetCode](https://leetcode.com/problems/length-of-longest-fibonacci-subsequence/description/)\n\n\n[spoiler]\nDP Insight: Let \\(longest(j,k)\\) be the length of longest path that ends in \\(sequence[j], sequence[k]\\)\n```python\ndef longest_fibonacci_like_subsequence(sequence):\n    index = { x: i for i, x in enumerate(sequence) }\n    longest = defaultdict(lambda: 2)\n    ans = 0\n    for k, z in enumerate(sequence):\n        for j in range(k):\n            # Due to the sequence being strictly increasing, there can only be one i\n            i = index.get(z - sequence[j], None)\n            if i is not None and i < j:\n                # We've found a triplet: sequence[i], sequence[j], sequence[k]\n                longest[j, k] = longest[i, j] + 1\n                if longest[j, k] > ans: ans = longest[j, k]\n    return ans if ans >= 3 else 0\n```\n",
    "tags":
      "dynamic_programming medium_programming_challenges subsequence_algorithms",
    "urgency": 6.95,
    "parent": "",
  },

  {
    "title": "Length of the Longest Sorted Sequence In a Shuffled Array",
    "description":
      "> Given an array \\(A\\), find the length of the longest sorted sub-sequence in \\(O(n)\\) time, e.g. \\([100, 4, 200, 1, 3, 2]\\) should output \\(4\\) because of \\([1, 2, 3, 4]\\).\n\n[spoiler]\n* Note that compare-based sorts are out of question because they are \\(O(n\\ log\\ n)\\).\n* Key-indexed sorting is linear, but we'd need to determine an alphabet. There are no constraints on the input.\n* We'll need to look at each number at most a constant number of times. Sets provide \\(O(1)\\) lookups!\n```python\nans = 0\nfor num in sequence:\n    # No need to start scanning in the middle of a consecutive sequence\n    if num-1 not in sequence:\n        next_num = num + 1\n        while next_num in sequence: next_num += 1\n        ans = max(ans, next_num - num)\nreturn ans\n```\n",
    "tags":
      "algorithms arrays hard_programming_challenges array_contiguous_elements",
    "urgency": 4.33,
    "parent": "",
  },

  {
    "title": "Number of Matching Subsequences in a String",
    "description":
      "> Given a string `S` and a dictionary of words `words`, find the number of `words[i]` that is a subsequence of `S`, e.g. `\"abcde\", [\"a\", \"bb\", \"acd\", \"ace\"]` returns \\(3\\) because of `\"a\", \"acd\", \"ace\"`\n\n\n\n* [Practice on LeetCode](https://leetcode.com/problems/number-of-matching-subsequences/description/)\n\n[spoiler]\n```python\ndef number_matching_subsequences(S, words):\n    char_indices, num_matching_subsequences = defaultdict(list), 0\n    for i in range(len(S)): char_indices[S[i]].append(i)\n    for word in words:\n        if matches(word, 0, 0, char_indices): num_matching_subsequences += 1\n    return num_matching_subsequences\n\ndef matches(word, index_word, index_char_indices, char_indices):\n    if index_word == len(word): return True\n    indices_list = char_indices[word[index_word]]\n    if len(indices_list) == 0 or index_char_indices > indices_list[-1]: return False\n    index_in_S = indices_list[bisect_left(indices_list, index_char_indices)]\n    return matches(word, index_word+1, index_in_S+1, char_indices)\n```\n",
    "tags":
      "string_processing medium_programming_challenges recursive_algorithms subsequence_algorithms",
    "urgency": 6.27,
    "parent": "",
  },

  {
    "title": "Implementation of a Probability Tree",
    "description":
      "> Alice starts with \\(0\\) points, and draws numbers randomly from the range \\([1, num\\_die\\_sides]\\) while she has less than \\(minimum\\_total\\) points. At the end of the game, what's the probability that she has \\(N\\) or less total points?\n\n\n* Try it on [LeetCode](https://leetcode.com/problems/new-21-game/description/)\n\n\n\n[spoiler]\n\nLet \\(dp[i]\\) be the probability that Alice wins the game given that she currently has \\(i\\) points.\n\n```python\ndp = [0.0] * (N + num_die_sides + 1)\nfor k in range(minimum_total, N + 1): dp[k] = 1.0\nS = min(N - minimum_total + 1, num_die_sides)\n# S = dp[minimum_total+1] + dp[minimum_total+2] + ... + dp[minimum_total+num_die_sides]\n\nfor k in range(minimum_total-1, -1, -1):\n    dp[k] = S / float(num_die_sides)\n    S += dp[k] - dp[k + num_die_sides]\n\nreturn dp[0]\n```\n",
    "tags": "dynamic_programming probability medium_programming_challenges",
    "urgency": 7.84,
    "parent": "",
  },

  {
    "title": "The Stone Pile Game (Optimal Strategy)",
    "description":
      "> There are \\(N\\) piles. Each pile has a positive number of stones, \\(piles[i]\\). Alex and Lee play a game where the person with the most stones wins. They take turns, and at each turn, the player can pick a pile from either end. Return `true` if and only if Alex wins the game. Assume both players play optimally. Alex plays first.\n\n[spoiler]\n\n* Let \\(dp(i, j)\\) be the largest score that Alex can achieve where the remaining piles are \\(piles[i], ..., piles[j]\\)\n* Keep track of the difference instead of the individual scores. Leads to cleaner code.\n* If you need to make globally optimal solutions, travel to the leaves of the graph before making any higher up decisions.\n* Note the special cases, e.g. if \\(N\\) is even, and the # of stones is odd, whoever plays first can always win.\n\n```python\n@lru_cache(maxsize=None)\ndef dp(i, j):\n    if i > j: return 0\n    parity = (j - i - N) % 2 # If parity is 1, then it's Alex's turn\n    if parity == 1: return max(dp(i+1, j) + piles[i], dp(i, j-1) + piles[j])\n    else: return min(dp(i+1, j) - piles[i], dp(i, j-1) - piles[j])\n\nreturn dp(0, N-1) > 0\n```",
    "tags":
      "dynamic_programming medium_programming_challenges recursive_algorithms",
    "urgency": 5.85,
    "parent": "",
  },

  {
    "title": "Binary Search on a Non-Existent List",
    "description":
      "> A positive integer is `magical` if it is divisible by either `A` or `B`. Return the \\(N^{th}\\) magical number modulo \\(10^9 + 7\\).\n\n```python\ndef nth_magical_number(self, N, A, B):\n    large_prime_number = 1000000007\n    if A == B: return (N * A) % large_prime_number\n    lcm = A * B / gcd(A, B)\n    if A < B: lo, hi = A, N * A\n    else: lo, hi = B, N * B\n\n    while lo < hi:\n        mid = int((lo + hi) / 2)\n        num_magic_nums_upto_mid = int(mid/A) + int(mid/B) - int(mid/lcm)\n        if num_magic_nums_upto_mid < N: lo = mid+1\n        else: hi = mid\n    return lo % large_prime_number\n```\n##Remarks\nMonotonically increasing sequence? Binary search! You don't need an explicit array.\n",
    "tags": "binary_search mathematics hard_programming_challenges",
    "urgency": 5.28,
    "parent": "",
  },

  {
    "title": "Profitable Schemes (2D Dynamic Programming)",
    "description":
      "> \\(groups[i] \\in [1, 100]\\) represents the number of people needed to carry out scheme \\(i\\) that produces \\(profits[i] \\in [0, 100]\\). Assuming that you have \\(G\\) people available, and that a person can participate in at most 1 profit-making activity, how many possible schemes can you choose such that you generate at least profit \\(P\\)?\n\n\n\n[spoiler]\n\n\nDP Core Idea: Keep track of \\(dp[p][g]\\), the number of schemes that generate profit \\(p\\) and require \\(g\\) people. If a scheme generates more than profit \\(P\\), assume it generates exactly profit \\(P\\). The question limits the size of the lists to 100, so DP will not run out of space.\n\n```python\ndp = [[0] * (G + 1) for _ in range(P + 1)]\ndp[0][0] = 1\n\nfor profit, group in zip(profits, groups):\n    dp2 = [row[:] for row in dp]\n    for old_profit in range(P + 1):\n        new_profit = min(old_profit + profit, P)\n        for old_group in range(G - group + 1):\n            new_group = old_group + group\n            dp2[new_profit][new_group] += dp[old_profit][old_group]\n    dp = dp2\nreturn sum(dp[-1])\n```\n",
    "tags":
      "dynamic_programming hard_programming_challenges iterative_algorithms",
    "urgency": 8.2,
    "parent": "",
  },

  {
    "title": "Longest Palindromic Substring",
    "description":
      "> Given a string \\(s\\), find the longest palindromic substring in \\(s\\)\n\n\n\n[spoiler]\nKey idea: Think of the palindrome as expanding outwards from the center. There are at most \\(2n-1\\) possible centers. Checking for a palindrome from the outside in works for single checks, but doesn't allow you to avoid recomputation.\n\n```python\ndef longest_palindromic_substring(s):\n    if len(s) <= 1: return s\n    len_longest_palindrome = 1\n    start_index = 0\n    for i in range(1, len(s)):\n        l1 = expand_palindrome_from_center(s, i, i)\n        l2 = expand_palindrome_from_center(s, i-1, i)\n        len_palindrome = l1 if l1 > l2 else l2\n        if len_palindrome > len_longest_palindrome:\n            len_longest_palindrome = len_palindrome\n            start_index = i - int(len_palindrome/2)\n    return s[start_index : start_index+len_longest_palindrome]\n\ndef expand_palindrome_from_center(s, left, right):\n    while left >= 0 and right < len(s) and s[left] == s[right]:\n        left -= 1\n        right += 1\n    return right - left -1\n```\n",
    "tags": "string_processing medium_programming_challenges",
    "urgency": 6.16,
    "parent": "",
  },

  {
    "title": "Minimum Path Sum",
    "description":
      "> Given a \\(m \\times n\\) grid filled with non-negative numbers, find a path from top left to bottom right which minimizes the sum of all numbers along its path.\n\n[spoiler]\nLet \\(dp[i][j]\\) be the lowest sum that can be obtained from paths that end at \\(grid[i][j]\\).\n\nInitialize \\(dp[0][0]\\) to the same value as \\(grid[0][0]\\) to serve as the base case.\n\n```python\ndef minimum_path_sum(grid):\n    M, N = len(grid), len(grid[0])\n    dp = [row[:] for row in grid]\n\n    for row in range(M):\n        for col in range(N):\n            if row > 0 and col > 0:\n                if dp[row-1][col] < dp[row][col-1]: dp[row][col] += dp[row-1][col]\n                else: dp[row][col] += dp[row][col-1]\n            elif row > 0: dp[row][col] += dp[row-1][col]\n            elif col > 0: dp[row][col] += dp[row][col-1]\n    return dp[M-1][N-1]\n```\n",
    "tags": "dynamic_programming path_finding medium_programming_challenges",
    "urgency": 4.85,
    "parent": "",
  },

  {
    "title": "Cherry Picking (Maximum Path in Both Directions)",
    "description":
      "> There's an \\(N \\times N\\) field of cherries. You start at \\((0, 0)\\) all the way till \\((N-1, N-1)\\) while only moving down/right. You then make your way back to \\((0, 0)\\) moving only up/left. A cell with \\(-1\\) blocks your path. What's the maximum number of cherries that you can collect?\n\n* Practice on [LeetCode](https://leetcode.com/problems/cherry-pickup/description/)\n\n[spoiler]\n\nLet \\(dp[r1][c1][c2]\\) = max # cherries obtained by two people starting at \\((r1, c1)\\) and \\((r2, c2)\\) heading towards \\((N-1, N-1)\\)\n\nBase case: \\(dp[N-1][N-1][N-1] = grid[N-1][N-1]\\)\n\nWe only need 3 variables because after \\(t\\) steps, any position \\((r, c)\\) that we can be in has the property \\(r + c = t\\).\n\n```python\ndef cherry_picking(self, grid):\n    N = len(grid)\n    memo = [[[None] * N for _1 in range(N)] for _2 in range(N)]\n  \n    def dp(r1, c1, c2):\n        r2 = r1 + c1 - c2\n        if (r1 == N or r2 == N or c1 == N or c2 == N\n            or grid[r1][c1] == -1 or grid[r2][c2] == -1): return -inf\n        elif r1 == c1 == N-1: return grid[r1][c1]\n        elif memo[r1][c1][c2] is not None: return memo[r1][c1][c2]\n        else:\n            ans = grid[r1][c1] + (c1 != c2) * grid[r2][c2] # TIL\n            ans += max(\n                dp(r1, c1+1, c2+1), dp(r1+1, c1, c2+1),\n                dp(r1, c1+1, c2), dp(r1+1, c1, c2)\n            )\n            memo[r1][c1][c2] = ans\n            return ans\n\n    return max(0, dp(0, 0, 0))\n```\n",
    "tags":
      "dynamic_programming path_finding hard_programming_challenges recursive_algorithms",
    "urgency": 9.11,
    "parent": "",
  },

  {
    "title": "Feature Selection in Machine Learning",
    "description":
      "* The Curse of Dimensionality: *to maintain sampling density \\(k\\), one needs \\(\\approx k^n\\) instances for \\(n\\) columns.*\n\n* The effective dimensionality tends to be lower since real tends to be clustered and insensitive to small changes.\n\n* Algorithms that self prune, e.g. decision trees, are more resistant to the curse than algorithms such as \\(kNN\\).\n\n* Naive ranking of features' predictiveness, using a filter such as information gain (IG), then pruning, may miss out on features that are more predictive when used together.\n\n* Think of feature selection as a greedy local search problem. Neighbors are generating by including/excluding one feature from the current subset of features. If none of the neighbors perform better (build a model, or use IG) than the current node, we terminate the search.\n\n* If the search starts from all the features, and goes removing one, we're likely to incur more computation but also catch interacting features.\n\n* If we start from the having no features, we'll typically have fewer computations, especially when you suspect that some of the features are redundant (i.e. highly correlate with other features)\n",
    "tags": "machine_learning graph_theory",
    "urgency": 6.2,
    "parent": "",
  },

  {
    "title": "Guy Stuff that Girls Don't Really Know",
    "description":
      "> Hanging out with friends, how was my day, toilet seat, secrets, ninja attack, apathy, compliments, ignoring hints, shower habits, fixing the car.\n\n\n\n[spoiler]\n\n* We can spend hours with our best friends and not say anything of significance.\n\n* That in a typical day, nothing happens where we feel the need to share details with anyone.\n\n* We don't miss the toilet seat on purpose or have bad aim. Sometimes the stream is hard to direct, and sometimes there's more than one.\n\n* There are significantly fewer secrets than you think. I'm boring as *shit*!\n\n* Sometimes we really are just thinking about nothing important. Just staring off into space imagining what we'd do if ninjas suddenly attacked this room.\n\n* When I say, \"I don't care\" it means....\"I don't care\". To elaborate: \"I am filled with apathy. Being forced to contribute to the conversation or solution would be the only disagreeable outcome for me.\"\n\n* When I was 13, some girl came up to me and asked for a hug because she liked my looks. I'm still living off that and there's plenty left in the tank to boost my spirits.\n\n* That dating and dealing with rejection makes a lot of men feel unwanted and unattractive. Some of us have just given up too and that's why we ignore your \"hints\"\n\n* We will open the hood of the car and stare at the engine even if we have no clue where that noise is coming from or what it means. After a couple minutes of that, we'll announce that it might be a random part we remember the name of and it should be checked out by a mechanic.\n\n* We cup the water in our hands by our chest when we shower and then let it all out when it starts to overflow\n\n[AskReddit Thread](https://old.reddit.com/r/AskReddit/comments/966s1c/what_are_some_guy_secrets_girls_dont_know_about/)\n",
    "tags": "reddit",
    "urgency": 3.55,
    "parent": "",
  },

  {
    "title": "Distributing Candy Under Constraints",
    "description":
      "> There are \\(N\\) children standing in a line. You're giving candies to these children subject to these two requirements. First, each child must have at least one candy. Second, a child with a higher rating gets more candies than their neighbors. What's the minimum number of candies that you must give?\n\n* Try on [LeetCode](https://leetcode.com/problems/candy/description/)\n\n[spoiler]\n\nKey Insight: Satisfy two sub-clauses instead.\n* Starting from L-R, ensure that each child rated higher than their left neighbor has more candy.\n* Starting from R-L, ensure that each child rated higher than their right neighbor has more candy.\n\n```java\npublic int candy(int[] ratings) {\n    int[] allocations = new int[ratings.length];\n    for (int i = 0; i < ratings.length; i++) allocations[i] = 1;\n    for (int i = 1; i < ratings.length; i++) {\n        if (ratings[i] > ratings[i-1]) allocations[i] = allocations[i-1] + 1;\n    }\n    for (int i = allocations.length-2; i >= 0; i--) {\n        if (ratings[i] > ratings[i+1] && allocations[i] <= allocations[i+1]) {\n            allocations[i] = allocations[i+1] + 1;\n        }\n    }\n    int sum = 0;\n    for (int i = 0; i < allocations.length; i++) sum += allocations[i];\n    return sum;\n}\n```\n",
    "tags": "arrays hard_programming_challenges array_transformations",
    "urgency": 8.33,
    "parent": "",
  },

  {
    "title": "Base-X Encoding a Positive Number",
    "description":
      "> Suppose you run a tiny URL where each unique long URL is a record in a database. How do you convert the the numeric database ID into a short URL?\n\n\n\n[spoiler]\n```java\npublic String baseXEncode(long n, String alphabet) {\n    if (n == 0) return alphabet.charAt(0);\n    StringBuilder sb = new StringBuilder();\n    int x = alphabet.length();\n    while (n != 0) {\n        sb.append(alphabet.charAt(n % x)); n = n / x;\n    }\n    sb.reverse(); return sb.toString();\n}\n\npublic long baseXDecode(String s, String alphabet) {\n    int x = alphabet.length(), sLen = s.length();\n    long n = 0, factor = Math.pow(x, sLen-1);\n    for (int i = 0; i < sLen; i++) {\n        n += alphabet.indexOf(s.charAt(i)) * factor;\n        factor = factor / x;\n    }\n    return n;\n}\n```\n",
    "tags": "string_processing medium_programming_challenges",
    "urgency": 7.1,
    "parent": "",
  },

  {
    "title": "Jump Game",
    "description":
      "> Given an array \\(nums\\) of non-negative integer, where each \\(nums[i]\\) denotes your maximum jump length from that index, what is the minimum number of jumps needed to get from the first index to the last one?\n\n\n\n* Practice on [LeetCode](https://leetcode.com/problems/jump-game-ii/)\n\n\n[spoiler]\nThis is a veiled BFS question. First process all the nodes reachable in \\(x\\) jumps at minimum, then those reachable in \\(x+1\\) jumps at minimum, etc.\n\n```python\ndef jumps(nums):\n    i, num_jumps, current_max, next_max, N = 0, 0, 0, 0, len(nums)\n    if N <= 1: return 0\n    while current_max - i + 1 > 0: # We can still make some jumps...\n        num_jumps += 1\n        while i <= current_max: # Process the indices on the 'queue'.\n            next_max = max(next_max, nums[i] + i)\n            if next_max >= N-1: return num_jumps\n            i += 1 # Notice that i never decrements\n        current_max = next_max\n    return inf # We're out of jumps and we did not hit index N-1\n```\n",
    "tags":
      "medium_programming_challenges breadth_first_search graph_algorithms",
    "urgency": 6.75,
    "parent": "",
  },

  {
    "title": "Evaluating Machine Learning Models",
    "description":
      "* What's the #1 rule for evaluating a model?\n\n\n* When should you go for a test set, and when should you live with cross validation only?\n\n\n* Describe the following techniques and any remarks on their usage: *hold out sampling, \\(k\\)-fold cross validation, leave-one-out cross validation, bootstrapping, out-of-time sampling*.\n\n\n* Define \\(precision\\) and \\(recall\\). How can we form an evaluation metric out of them?\n\n\n* How would you determine the average class accuracy for a multi-label classification problem?\n\n\n* What is a profit matrix and when is it useful?\n\n[Relevant Notes: Evaluating ML Models](https://1drv.ms/u/s!AvGG5UqSCqXTmRbR7KbP0BfMSwtg)",
    "tags": "machine_learning",
    "urgency": 6.24,
    "parent": "",
  },

  {
    "title": "Container with the Most Water",
    "description":
      "> Given \\(n\\) non-negative integers \\(a_1, a_2, ..., a_n\\) , where each represents a point at coordinate \\((i, a_i)\\), \\(n\\) vertical lines are drawn such that the two endpoints of line \\(i\\) is at \\((i, a_i)\\) and \\((i, 0)\\). Find two lines, which together with x-axis forms a container, such that the container contains the most water.\n\n[spoiler]\n\nInsight: Start forming the container using the farthest apart lines, and then contract such that you're trying to get the largest such container.\n\n```java\npublic int maxAreaLinear(int[] height, boolean debug) {\n    if (height.length < 2) return 0;\n    int capacity, maxCapacity = 0, i = 0, j = height.length-1;\n\n    while (i <= j) {\n        if (height[i] < height[j]) {\n            capacity = height[i] * (j - i); i += 1;\n        } else {\n            capacity = height[j] * (j - i); j -= 1;\n        }\n        if (capacity > maxCapacity) maxCapacity = capacity;\n    }\n    return maxCapacity;\n}\n```\n",
    "tags":
      "arrays medium_programming_challenges array_search_under_constraints",
    "urgency": 5.76,
    "parent": "",
  },

  {
    "title": "Linked List Problems",
    "description":
      "> Question #1: Design an LRU cache such that both `get()` and `put()` are both constant time. The capacity of the cache will be given to you.\n> Question #2: Merge \\(k\\) linked lists whose elements are already sorted.\n\n[spoiler]\nSee [sample code for LRU cache](https://github.com/dchege711/better_programmer/blob/chege_solutions/linked_lists/hard_lru_cache/lru_cache.py). What bugs should you look out for?\n\n```java\npublic ListNode mergeKLists(ListNode[] lists, boolean debug) {\n    PriorityQueue<ListNode> smallestKNodes = new PriorityQueue<>(new ListNodeComparator());\n    for (int i = 0; i < lists.length; i++) {\n        if (lists[i] != null) smallestKNodes.add(lists[i]);\n    }\n    ListNode node = null, root = null, tailNode = null;\n    while (!smallestKNodes.isEmpty()) {\n        node = smallestKNodes.poll();\n        if (node != null) {\n            if (node.next != null) smallestKNodes.add(node.next);\n            node.next = null; // Phew!\n            if (tailNode == null) { tailNode = node; root = tailNode; }\n            else { tailNode.next = node; tailNode = tailNode.next; }\n        }\n    }\n    return root;\n}\n```\n",
    "tags": "linked_lists caching hard_programming_challenges",
    "urgency": 6.38,
    "parent": "",
  },

  {
    "title": "Number of Islands (Connected Components)",
    "description":
      "> Given a 2d grid map of `'1'`s (land) and `'0'`s (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.\n\n\n\n[spoiler]\n\n```python\ndef __process_bfs(self, grid):\n    land_spots = set()\n    for i, row in enumerate(grid):\n        for j, _ in enumerate(row):\n            if grid[i][j] == \"1\": land_spots.add((i, j))\n\n    num_islands = 0\n    while len(land_spots) > 0:\n        adjacent_spots = set()\n        spot = land_spots.pop()\n        adjacent_spots.add(spot)\n\n        while len(adjacent_spots) > 0:\n            spot = adjacent_spots.pop()\n            try: land_spots.remove(spot)\n            except KeyError: pass # The first item is already popped\n            for neighbor in self.__get_neighbors(spot, land_spots):\n                adjacent_spots.add(neighbor)\n                land_spots.remove(neighbor)\n\n        num_islands += 1\n\n    return num_islands\n```\n",
    "tags":
      "medium_programming_challenges graph_algorithms breadth_first_search connected_components",
    "urgency": 5.7,
    "parent": "",
  },

  {
    "title": "Maximum Number of Points on a Line",
    "description":
      "> Given \\(n\\) 2D points, what is the maximum number of points that lie on the same straight line?\n\n\n\n[spoiler]\n```python\ndef __quadratic_solution(self, points):\n    N = len(points)\n    max_num_collinear_points = 0\n   \n    for i in range(N):\n        num_points_on_slope = defaultdict(lambda: 1)\n        origin_multiplicity = 0\n        origin_x, origin_y = points[i].x, points[i].y\n\n        for j in range(i+1, N):\n            other_x, other_y = points[j].x, points[j].y\n\n            if other_x == origin_x and other_y == origin_y:\n                origin_multiplicity += 1\n                continue\n\n            if origin_x == other_x: slope = 'inf'\n\n            else:\n                delta_x, delta_y = origin_x - other_x, origin_y - other_y\n                largest_factor = gcd(delta_y, delta_x)\n                slope = (delta_y // largest_factor, delta_x // largest_factor)\n                if slope[0] < 0 and slope[1] < 0: slope = (-slope[0], -slope[1])\n                elif slope[0] < 0 or slope[1] < 0: slope = (-abs(slope[0]), abs(slope[1]))\n\n            num_points_on_slope[slope] += 1\n\n        current_max = 0\n        for num_points in num_points_on_slope.values():\n            if num_points > current_max: current_max = num_points\n        current_max += origin_multiplicity\n        if current_max > max_num_collinear_points:\n            max_num_collinear_points = current_max\n\n    return max_num_collinear_points\n```\n",
    "tags": "computational_geometry hard_programming_challenges",
    "urgency": 7.15,
    "parent": "",
  },

  {
    "title": "Trapping Rain Water",
    "description":
      "> Given \\(n\\) non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.\n\n* How would you do it in \\(O(n)\\) time and space? How would you reduce the number of traversals made and space used?\n\n[spoiler]\n\n```python\ndef __linear_time_constant_space(self, height: List[int]) -> int:\n    left, right = 0, len(height) - 1\n    collected_water, left_max, right_max = 0, 0, 0\n\n    while left < right:\n        if height[left] < height[right]:\n            if height[left] >= left_max: left_max = height[left]\n            else: collected_water += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max: right_max = height[right]\n            else: collected_water += right_max - height[right]\n            right -= 1\n    return collected_water\n```\n",
    "tags":
      "dynamic_programming arrays hard_programming_challenges iterative_algorithms array_search_under_constraints",
    "urgency": 7.14,
    "parent": "",
  },

  {
    "title": "Finding the Minimum (or Maximum) in a BST",
    "description":
      "> Implement a method that searches for the min (or max) key in a BST. What's the runtime?\n\n[spoiler]\n* Searching for the minimum (or maximum) key takes \\(O(h)\\) time.\n```c\nnode tree_minimum(x) {\n    while (x.left != null) x = x.left; // Finding the max follows the right pointers till we hit null\n    return x; // The BST property guarantees this will be correct.\n}\n```\n",
    "tags":
      "binary_search data_structures medium_programming_challenges binary_search_trees order_statistics",
    "urgency": 5.69,
    "parent": "",
  },

  {
    "title": "Arguing About Tails under Limited Information",
    "description":
      "* What theorem gives you an idea of how wrong you can expect to be? What are the strengths and weaknesses of that theorem?\n* If you have a series of events, what tools can you use to argue about the left portion of that tail?\n\n[spoiler]\n## Markov's Inequality\n\n* Let \\(X\\) be a non-negative random variable. If \\(c > 0\\), then \\( \\mathbb{P}\\{X \\ge c\\} \\le \\frac{ \\mathbb{E}[X] } { c } \\rightarrow \\mathbb{P}\\{X \\ge c \\cdot \\mathbb{E}[X]\\} \\le \\frac {1}{c} \\)\n* Markov gives weak bounds because it doesn't have much info on \\(X\\)\n\n## Upper Bound - The Union Bound\n\n* For events \\(E_1, ..., E_n\\), we have \\( \\mathbb{P}\\{(E_1 \\cup ... \\cup E_n\\} \\le \\mathbb{P}[E_1] + ... + \\mathbb{P}[E_n] \\)\n* This is a very conservative bound and doesn't care whether the events are independent.\n\n## Lower Bound - Murphy's Law\n\n* If \\(E_1, ..., E_n\\) are mutually independent and \\(X\\) is the number of these events that occur, then \\( \\mathbb{P}\\{E_1 \\cup ... \\cup E_n\\} \\ge 1 - e^{-\\mathbb{E}[X]} \\)\n* The probability of at least one event happening is sandwiched between those two bounds.",
    "tags": "probability cos340 mathematics",
    "urgency": 6.38,
    "parent": "",
  },

  {
    "title": "Determining the Rank of an Element in a BST",
    "description":
      "* Describe an algorithm to find the rank of an element in a BST in \\(O(log(n))\\) time.\n* Is there a way to make this \\(O(1)\\) time? At what cost?\n\n\n[spoiler]\nAugment each node `x` such that `x.size` is the number of nodes in the subtree rooted at `x` (including `x` itself).\n\n```\nint rank(T, x) {\n    r = x.left.size + 1;\n    y = x;\n    while (y != T.root) {\n        // If y is a left child, then neither y.p nor any node in y.p's right subtree precedes x\n        // If y is a right child, then all nodes in y.p's left subtree precede x, as does y.p itself\n        if (y == y.parent.right) r += y.parent.left.size + 1;\n        y = y.parent;\n    }\n    return r;\n}\n```",
    "tags": "binary_search_trees data_structures medium_programming_challenges",
    "urgency": 5.68,
    "parent": "",
  },

  {
    "title": "Product of Array Except Self",
    "description":
      "> Given an array `nums` of `n` integers where \\(n > 1\\),  return an array `output` such that `output[i]` is equal to the product of all the elements of `nums` except `nums[i]`. Use \\(O(n)\\) time but don't use the division operator.\n\n[spoiler]\nIntuition: \\(output[i] = (nums[0] \\times ... \\times nums[i-1]) \\times (nums[i+1] \\times ... nums[n-1])\\)\n\n```python\ndef product_of_array_except_self(self, nums: List[int]) -> List[int]:\n    N, running_product = len(nums), 1\n    products_except_self = []\n    for i in range(N):\n        products_except_self.append(running_product)\n        running_product *= nums[i]\n\n    running_product = 1\n    for i in range(N-1, -1, -1):\n        products_except_self[i] *= running_product\n        running_product *= nums[i]\n\n    return products_except_self\n```\n",
    "tags": "arrays medium_programming_challenges array_contiguous_elements",
    "urgency": 6.37,
    "parent": "",
  },

  {
    "title": "Fun Facts Reddit",
    "description":
      "Cruising altitude, helicopters, PSR J1748-2446ad, bakery at Pudding Lane, hands down.\n\n[spoiler]\n* The average cruising altitude of a commercial airliner is about 35,000ft. The deepest point of the Mariana trench is about 36,000ft.\n\n* Helicopter is made up of helico (meaning spiral) and pter (meaning wings).\n\n* PSR J1748-2446ad, 2 solar masses & 16km radius, is the fastest rotating neutron star that we know of, spinning at a whopping 716 times per second. At the equator, the star spins at \\(.24c\\)\n\n* The Great Fire of London was started in a bakery in Pudding Lane in 1666. And it was all the fault of a young boy who was on his first day of apprenticeship there. The baker died but the boy lived.\n\n\n* The phrase \"hands down\" comes from horseracing and refers to a jockey who is so far ahead that he can afford drop his hands and loosen the reins (usually kept tight to encourage a horse to run) and still easily win.\n\n\n[Ask Reddit: What is your favorite useless fact?](https://old.reddit.com/r/AskReddit/comments/9bj5c4/what_is_your_favorite_useless_fact/)\n",
    "tags": "reddit",
    "urgency": 5.07,
    "parent": "",
  },

  {
    "title": "Favorite Useless Facts",
    "description":
      "Tell me a story about ladybugs, the hulk, wombat, blue whales and dolphins.\n\n[spoiler]\n* Male ladybugs can mate with a dead female ladybug for up to 4 hours before realizing something is wrong. *To be fair, it's not always obvious. Oof!*\n\n* The original Hulk was grey but due to ink problems, became green. Same reason for Iron Man not being iron colored. Also Jack Kirby was in a rush hence didn't draw the Invisible Woman.\n\n* Wombat poo comes in cubes. Their ribbed large intestines squash the poo to absorb as much water. The poop is so dry that the round sphincter can't reshape it.\n\n* Despite their size, blue whales cannot swallow an object wider than a beach ball. Hello Jonah!\n\n\n* Dolphins have their own names. Young females take a variation of their mother's name, while males take their mother's name.\n\n\n[Ask Reddit: What is your favorite useless fact?](https://old.reddit.com/r/AskReddit/comments/9bj5c4/what_is_your_favorite_useless_fact/)",
    "tags": "reddit",
    "urgency": 5.8,
    "parent": "",
  },

  {
    "title": "Private Control Flow Illusion",
    "description":
      "* In what states can a process be in? Which of the transitions are preemptive?\n* What happens during the transitions? How are transitions controlled?\n\n[spoiler]\nA process can be in any of these 3 states. Some transitions are preemptive (involuntary).\n\n* READY. If its time has come, go to RUNNING.\n* RUNNING. If its time slice expires, preemptively go to READY. If it requests a (time-consuming) system service, preemptively go to BLOCKED.\n* BLOCKED. If the requested service has been finished, go to READY.\n\n\n\nWhen these transitions occur, there is a context switch.\n* The process's context *(id, status, priority, time consumed, reference to its page table, etc)* is stored in a process control block (PCB).\n* Exceptions are used to control the transitions between the states.\n* The OS maintains at least 3 sets that contain PCBs of the programs in each state.\n\n",
    "tags": "c cos217 c_system linux",
    "urgency": 4,
    "parent": "",
  },

  {
    "title": "Dynamic Memory Management II",
    "description":
      "Describe how `malloc` and `free` are implemented in these DMM techniques: *doubly linked lists, bins, VM mapping functions*\nComment on the space and time usage of each technique.\n\n\n\n[spoiler]\n\n**Doubly Linked List Implementation (Heap Section)**\n\n* `malloc`: Similar to list implementation.\n* `free`: Free chunk and coalesce with neighbors if possible. Free list is unordered.\n* Space (good): \\(32\\) bytes header + footer overhead. Some internal & external fragmentation is unavoidable.\n* Time (good): \\(O(n)\\) for `malloc` isn't bad but susceptible to long free list with big chunks at the end. \\(O(1)\\) for `free`.\n\n**Bins Implementation (Heap Section)**\n\n* `malloc`: Like doubly linked list implementation, but search in proper bin(s) instead of entire free list.\n* `free`: Like doubly linked list implementation, but insert freed chunk into proper bin instead of free list.\n* Space (good): Header, footer and bin array overhead. Using best-fit could decrease internal fragmentation & splitting. Some internal & external fragmentation is still unavoidable.\n\n**VM Mapping Functions**\n\n* `malloc`: Do a system call `mmap()` to ask OS for a virtual address of a virtual memory spot.\n* `free`: Do a system call `munmap()` to ask OS to free `n` bytes of memory at given spot.\n* Space: Depends on OS. OS deals with fragmentation.\n* Time: `malloc` and `free` are slow for small chunks. `free` for large chunks shrinks page table, which is great!",
    "tags": "c memory cos217",
    "urgency": 3.78,
    "parent": "",
  },

  {
    "title": "Word Search in a 2D Grid",
    "description":
      "> Given a 2D board and a word, find if the word exists (adjacent cells are defined vertically and horizontally) in the grid. Which optimization is crucial?\n\n* Practice on [LeetCode](https://leetcode.com/problems/word-search/description/)\n\n\n[spoiler]\n* Structure your recursion such that you can return early. For an example of a bad implementation, see [attempt #1](https://github.com/dchege711/better_programmer/tree/chege_solutions/graphs_and_trees/medium_word_search)\n\n\n```python\ndef word_search(self, board, word):\n    def __search(idx_word, row, col):\n        if board[row][col] != word[idx_word]: return False\n        if idx_word == len_word-1: return True\n\n        idx_word += 1\n        original_char = board[row][col]\n        board[row][col] = None\n        for d in [(0, 1), (0, -1), (1, 0), (-1, 0)]:\n            next_row, next_col = row + d[0], col + d[1]\n            if -1 < next_row < num_rows and -1 < next_col < len(board[row]) and board[next_row][next_col]:\n                if __search(idx_word, next_row, next_col): return True\n        board[row][col] = original_char\n        return False\n\n    if not board: return False\n    if not word: return True\n    if __grid_lacks_enough_chars(): return False\n\n    num_rows, len_word = len(board), len(word)\n    for row in range(num_rows):\n        for col in range(len(board[row])):\n            if __search(0, row, col): return True\n    return False\n```\n",
    "tags":
      "medium_programming_challenges recursive_algorithms graph_algorithms depth_first_search",
    "urgency": 7.08,
    "parent": "",
  },

  {
    "title": "Test Whether a Number is a Perfect Square",
    "description":
      "> Given a positive integer `num`, write a function which returns `True` if `num` is a perfect square else `False`.\n\n\n[spoiler]\n```python\ndef isPerfectSquare(self, num):\n    return binary_search(1, num)\n\n    def binary_search(self, lo, hi):\n        if lo > hi: return False\n        mid = int(lo + (hi - lo) / 2)\n        product = mid * mid\n        if product == num: return True\n        elif product > num: return binary_search(lo, mid-1)\n        else: return binary_search(mid+1, hi)\n```\n",
    "tags": "medium_programming_challenges binary_search recursive_algorithms",
    "urgency": 4.69,
    "parent": "",
  },

  {
    "title": "Search in a Rotated Sorted Array",
    "description":
      "> Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand, i.e., `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`. You are given a target value to search. If found in the array return its index, otherwise return -1. You may assume no duplicate exists in the array.\n\n\n* [Practice on LeetCode](https://leetcode.com/problems/search-in-rotated-sorted-array/)\n\n\n[spoiler]\n* If we're searching for `1`, it'd be nice if we had `[-inf, -inf, -inf, -inf, 0, 1, 2]`.\n* If we're searching for 5, it'd be convenient to have `[4, 5, 6, 7, inf, inf, inf]`.\n* The algorithm tries to transform this array on the go.\n\n```java\npublic int useOneBinarySearch(int[] nums, int target, boolean debug) {\n    int lo = 0, hi = nums.length - 1;\n    int mid, midNumber, numAtZero;\n\n    if (nums.length > 0) numAtZero = nums[0];\n    else numAtZero = Integer.MIN_VALUE;\n  \n    while (lo <= hi) {\n        mid = lo + (hi - lo) / 2;\n        if ((nums[mid] < numAtZero) == (target < numAtZero)) midNumber = nums[mid];\n        else if (target < numAtZero) midNumber = Integer.MIN_VALUE;\n        else midNumber = Integer.MAX_VALUE;\n      \n        if (midNumber > target) hi = mid - 1;\n        else if (midNumber < target) lo = mid + 1;\n        else return mid;\n    }\n    return -1;\n}\n```\n",
    "tags":
      "binary_search medium_programming_challenges array_search_under_constraints arrays",
    "urgency": 6.47,
    "parent": "",
  },

  {
    "title": "Group Anagrams Together",
    "description":
      "> Given an array of strings, group anagrams together. Give two algorithms. Under what conditions would you pick one over the other?\n\n\n[spoiler]\n```python\ndef __sort_each_word_then_group(self, words):\n    anagrams_to_words = defaultdict(list)\n    for word in words:\n        sorted_chars = tuple(sorted(list(word)))\n        anagrams_to_words[sorted_chars].append(word)\n    return list(anagrams_to_words.values())\n```\n",
    "tags": "medium_programming_challenges string_processing",
    "urgency": 4.74,
    "parent": "",
  },

  {
    "title": "Minimum Window Substring",
    "description":
      "> Given a string `S` and a string `T`, find the minimum window in `S` which will contain all the characters in `T` in complexity \\(O(n)\\)\n\n\n\n[spoiler]\n```python\ndef __using_sliding_window(self, s, t):\n    t_chars, len_s = defaultdict(lambda: 0), len(s)\n    for c in t: t_chars[c] += 1\n\n    left, right, min_length, substr_start = 0, 0, inf, 0\n    t_chars_substr = defaultdict(lambda: 0) # The frequencies of t's chars in window\n    missing_chars = set(t_chars.keys()) # The chars of t missing from the window\n\n    while right < len_s and left < len_s:\n\n        while missing_chars and right < len_s:\n            if s[right] in t_chars: t_chars_substr[s[right]] += 1\n            if s[right] in missing_chars and t_chars_substr[s[right]] >= t_chars[s[right]]: missing_chars.remove(s[right])\n            right += 1\n\n        while left < len_s and ((s[left] not in t_chars) or t_chars_substr[s[left]] > t_chars[s[left]]):\n            if s[left] in t_chars_substr: t_chars_substr[s[left]] -= 1\n            left += 1\n\n        if not missing_chars and right - left < min_length:\n            min_length = right - left\n            substr_start = left\n\n        if left < len_s:\n            t_chars_substr[s[left]] -= 1\n            missing_chars.add(s[left])\n\n        left += 1\n\n    if min_length != inf: return s[substr_start: substr_start + min_length]\n    else: return \"\"\n```\n",
    "tags": "sliding_window hard_programming_challenges string_processing",
    "urgency": 8.31,
    "parent": "",
  },

  {
    "title": "Greatest Subarray Product",
    "description":
      "> Given an integer array `nums`, find the contiguous subarray within an array (containing at least one number) which has the largest product.\n\n[spoiler]\n```python\ndef maxProduct(self, nums):\n    return max(self._max_product(nums), self._max_product(list(reversed(nums))))\n\ndef _max_product(self, nums):\n    if len(nums) == 1: return nums[0]\n    max_product, running_product, positive_factor = -inf, -inf, -inf\n    for num in nums:\n        if num != 0:\n            if running_product == -inf: running_product = 1\n            running_product *= num\n            if running_product > 0: positive_factor = running_product\n        else:\n            max_product = max(max_product, running_product, positive_factor, 0)\n            running_product, positive_factor = -inf, -inf\n    return max(max_product, running_product, positive_factor)\n```\n",
    "tags": "medium_programming_challenges arrays array_contiguous_elements",
    "urgency": 5.1,
    "parent": "",
  },

  {
    "title": "Topological Sort on an Alien Dictionary",
    "description":
      "> You receive a list of non-empty words from a dictionary, where words are sorted lexicographically by the rules of this new language. Derive the order of letters in this language.\n\n\n[spoiler]\n\n```java\nclass Solution {\n    private final int N = 26;\n    private final int FLAG_DOES_NOT_EXIST = -1;\n    private final int FLAG_NOT_VISITED = 0;\n    private final int FLAG_VISITING = 1;\n    private final int FLAG_VISITED = 2;\n    \n    public String alienOrder(String[] words) {\n        boolean[][] adj = new boolean[N][N];\n        int[] visited = new int[N];\n\n\n        buildGraph(words, adj, visited);\n        // adj[][] has all the possible pairwise orders that could be determined\n        // visited[] has marked all the chars that appear in the dictionary\n\n\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < N; i++) {\n            if (visited[i] == this.FLAG_NOT_VISITED) {\n                if (!dfs(adj, visited, sb, i)) return \"\";\n            }\n        }\n        return sb.reverse().toString();\n    }\n\n\n    public boolean dfs(boolean[][] adj, int[] visited, StringBuilder sb, int i) {\n        visited[i] = this.FLAG_VISITING;\n        for (int j = 0; j < N; j++) {\n            if (adj[i][j]) {\n                if (visited[j] == this.FLAG_VISITING) return false; // cycle   \n                if (visited[j] == this.FLAG_NOT_VISITED) {\n                    if (!dfs(adj, visited, sb, j)) return false;\n                }\n            }\n        }\n        visited[i] = this.FLAG_VISITED;\n        sb.append((char) (i + 'a'));\n        return true;\n    }\n\n\n    public void buildGraph(String[] words, boolean[][] adj, int[] visited) {\n        Arrays.fill(visited, this.FLAG_DOES_NOT_EXIST); \n        \n        // For each word i...\n        for (int i = 0; i < words.length; i++) {\n\n\n            // ... note that word_i's chars are present in this dictionary\n            for (char c : words[i].toCharArray()) \n                visited[c - 'a'] = this.FLAG_NOT_VISITED;\n\n\n            // ... if possible, compare word i with the previous word...\n            if (i > 0) {\n                String w1 = words[i - 1], w2 = words[i];\n                int shorterLength = Math.min(w1.length(), w2.length());\n                for (int j = 0; j < shorterLength; j++) {\n                    char c1 = w1.charAt(j), c2 = w2.charAt(j);\n                    if (c1 != c2) { \n                        // ... make c1 --> c2 in the adjacency graph \n                        // ... this is all that we can learn\n                        adj[c1 - 'a'][c2 - 'a'] = true; break;\n                    }\n                }\n            }\n        }\n    }\n}\n```\n",
    "tags": "graph_theory hard_programming_challenges string_processing",
    "urgency": 7.56,
    "parent": "",
  },

  {
    "title": "Topological Sort on an Alien Dictionary",
    "description":
      "> You receive a list of non-empty words from a dictionary, where words are sorted lexicographically by the rules of this new language. Derive the order of letters in this language.\n\n[spoiler]\n```java\nclass Solution {\n    /* Definitions for N, FLAG_DOES_NOT_EXIST, FLAG_NOT_VISITED, FLAG_VISITING, FLAG_VISITED */\n    public String alienOrder(String[] words) {\n        boolean[][] adj = new boolean[N][N];\n        int[] visited = new int[N];\n\n        buildGraph(words, adj, visited);\n        // adj[][] has all the possible pairwise orders that could be determined\n        // visited[] has marked all the chars that appear in the dictionary\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < N; i++) {\n            if (visited[i] == this.FLAG_NOT_VISITED) {\n                if (!dfs(adj, visited, sb, i)) return \"\";\n            }\n        }\n        return sb.reverse().toString();\n    }\n    public boolean dfs(boolean[][] adj, int[] visited, StringBuilder sb, int i) {\n        visited[i] = this.FLAG_VISITING;\n        for (int j = 0; j < N; j++) {\n            if (adj[i][j]) {\n                if (visited[j] == this.FLAG_VISITING) return false; // cycle\n                if (visited[j] == this.FLAG_NOT_VISITED) {\n                    if (!dfs(adj, visited, sb, j)) return false;\n                }\n            }\n        }\n        visited[i] = this.FLAG_VISITED;\n        sb.append((char) (i + 'a'));\n        return true;\n    }\n    public void buildGraph(String[] words, boolean[][] adj, int[] visited) {\n        Arrays.fill(visited, this.FLAG_DOES_NOT_EXIST);\n        for (int i = 0; i < words.length; i++) { // For each word i...\n            // ... note that word_i's chars are present in this dictionary\n            for (char c : words[i].toCharArray()) visited[c - 'a'] = this.FLAG_NOT_VISITED;\n            // ... if possible, compare word i with the previous word...\n            if (i > 0) {\n                String w1 = words[i - 1], w2 = words[i];\n                int shorterLength = Math.min(w1.length(), w2.length());\n                for (int j = 0; j < shorterLength; j++) {\n                    char c1 = w1.charAt(j), c2 = w2.charAt(j);\n                    if (c1 != c2) {\n                        // ... make c1 --> c2 in the adjacency graph. That is all that we can learn\n                        adj[c1 - 'a'][c2 - 'a'] = true; break;\n                    }\n                }\n            }\n        }\n    }\n}\n```\n",
    "tags":
      "hard_programming_challenges string_processing recursive_algorithms graph_algorithms topological_sort",
    "urgency": 8.19,
    "parent": "",
  },

  {
    "title": "Basic Calculator II",
    "description":
      "> Implement a basic calculator to evaluate a simple expression string. The expression string contains only non-negative integers, +, -, *, / operators and empty spaces . The integer division should truncate toward zero.\n\n[Original Leet Code Question](https://leetcode.com/problems/basic-calculator-ii/description/)\n\n[spoiler]\n```python\ndef calculate(self, expression: str) -> int:\n    operators = set([\"+\", \"-\", \"*\", \"/\"])\n    ops = []\n    for c in expression:\n        if c in operators: ops.append(c)\n    digits = [ int(x.strip()) for x in re.split(r'[+-/*]', expression) ]\n    if not digits: return None\n    stack = []\n    stack.append(digits[0])\n    for op, digit in zip(ops, digits[1::]):\n        if op == \"-\": stack.append(-digit)\n        elif op == \"+\": stack.append(digit)\n        else:\n            previous_digit = stack.pop()\n            if op == \"/\":\n                if previous_digit < 0: # Because int(-3/2) == -2\n                    stack.append(-(abs(previous_digit) // digit))\n                else: stack.append(previous_digit // digit)\n            else: stack.append(previous_digit * digit)\n    return sum(stack)\n```\n",
    "tags": "string_processing medium_programming_challenges",
    "urgency": 5.67,
    "parent": "",
  },

  {
    "title": "Maximal Square on a Boolean Grid",
    "description":
      "> Given a 2D binary matrix filled with `0`'s and `1`'s, find the largest square containing only `1`'s and return its area.\n\n[spoiler]\n```python\ndef __using_dp_optimal_space(self, grid):\n    if not grid: return 0\n    max_len = 0\n    previous_row_dp = list(map(int, grid[0]))\n    for num in previous_row_dp:\n        if num == 1:\n            max_len = 1\n            break\n    for i in range(1, len(grid)):\n        current_row_dp = list(map(int, grid[i]))\n        for j, num_str in enumerate(grid[i]):\n            if num_str == \"1\":\n                if j > 0:\n                    current_row_dp[j] = 1 + min(\n                        previous_row_dp[j], previous_row_dp[j-1], current_row_dp[j-1]\n                    )\n            if current_row_dp[j] > max_len: max_len = current_row_dp[j]\n        previous_row_dp = current_row_dp\n\n    return max_len * max_len\n```\n",
    "tags": "dynamic_programming medium_programming_challenges",
    "urgency": 6.6,
    "parent": "",
  },

  {
    "title": "Cheapest Flights Within K Stops",
    "description":
      "> Given all the cities and fights, find the cheapest price from `src` to `dst` with up to `k` stops. If there is no such route, output `-1`. What is the crucial optimization?\n\n\n\n* Practice on [LeetCode](https://leetcode.com/problems/cheapest-flights-within-k-stops/description/)\n\n\n\n[spoiler]\n```python\ndef __using_dijkstra(self, _, flights, src, dst, K):\n    graph = defaultdict(dict)\n    for source, dest, cost in flights: graph[source][dest] = cost\n    best = defaultdict(lambda: inf)\n    pq = [(0, 0, src)]\n    while pq:\n        cost, num_stops, place = heapq.heappop(pq)\n        if num_stops > K+1 or cost > best[(num_stops, place)]: continue\n        if place == dst: return cost\n\n        for neighbor, cost_to_neighbor in graph[place].items():\n            new_cost = cost + cost_to_neighbor\n            if new_cost < best[(num_stops + 1, neighbor)]:\n                heapq.heappush(pq, (new_cost, num_stops+1, neighbor))\n                best[num_stops+1, neighbor] = new_cost\n    return -1\n```\n",
    "tags":
      "medium_programming_challenges algorithms graph_algorithms dijkstras_algorithm",
    "urgency": 6.63,
    "parent": "",
  },

  {
    "title": "Identify Near Duplicates in an Unsorted Array",
    "description":
      "> Given an array of integers, find out whether there are two distinct indices `i` and `j` in the array such that the absolute difference between `nums[i]` and `nums[j]` is at most `t` and the absolute difference between `i` and `j` is at most `k`.\n\n\n* Provide 3 algorithms that can solve this problem. Comment on the intuition and the efficiency behind each one.\n\n\n[spoiler]\n```java\nprivate long getButcketID(long x, long bucketWidth) {\n    // In Java, `-3 / 5 = 0` and but we need `-3 / 5 = -1`.\n    // return x < 0 ? ((x + 1) / bucketWidth) - 1 : x / bucketWidth;\n    return Math.floorDiv(x, bucketWidth);\n}\n\nprivate boolean useBuckets(int[] nums, int maxAbsoluteIndexDiff, int maxAbsoluteElementsDiff) {\n    if (maxAbsoluteElementsDiff < 0) return false;\n\n    HashMap<Long, Long> buckets = new HashMap<>();\n    long bucketWidth = (long)maxAbsoluteElementsDiff + 1;\n\n    for (int i = 0; i < nums.length; ++i) {\n        long bucketID = getButcketID(nums[i], bucketWidth);\n        // Each bucket may contain at most one element\n        if (buckets.containsKey(bucketID)) return true;\n        // check the neighbor buckets for almost duplicate\n        if (buckets.containsKey(bucketID - 1) && Math.abs(nums[i] - buckets.get(bucketID - 1)) < bucketWidth)\n            return true;\n        if (buckets.containsKey(bucketID + 1) && Math.abs(nums[i] - buckets.get(bucketID + 1)) < bucketWidth)\n            return true;\n        // now bucket bucketID is empty and no almost duplicate in neighbor buckets\n        buckets.put(bucketID, (long)nums[i]);\n        // Only keep track of elements that are within the appropriate window\n        if (i >= maxAbsoluteIndexDiff) buckets.remove(getButcketID(nums[i - maxAbsoluteIndexDiff], bucketWidth));\n    }\n    return false;\n}\n```\n",
    "tags":
      "arrays medium_programming_challenges bins binary_search_trees dictionaries array_search_under_constraints",
    "urgency": 6.84,
    "parent": "",
  },

  {
    "title": "Pour Water",
    "description":
      "> We are given an elevation map, `heights[i]` representing the height of the terrain at that index. The width at each index is 1. After `V` units of water fall at index `K`, how much water is at each index?\n\nWater first drops at index K and rests on top of the highest terrain or water at that index. Then, it flows according to the following rules:\n* If the droplet would eventually fall by moving left, then move left.\n* Otherwise, if the droplet would eventually fall by moving right, then move right.\n* Otherwise, rise at it's current position.\n\n[spoiler]\n```python\ndef __by_simulation(self, heights, num_drops, starting_index):\n    for _ in range(num_drops):\n        final_index = starting_index\n        for delta in (-1, 1):\n            index = starting_index + delta\n            while 0 <= index < len(heights):\n                if heights[index] <= heights[index-delta]:\n                    if heights[index] < heights[index-delta]: final_index = index\n                    index += delta\n                else: break\n            if final_index != starting_index: break\n        heights[final_index] += 1\n    return heights\n```\n[Source: Leet Code #755](https://leetcode.com/problems/pour-water/description/)\n",
    "tags":
      "arrays medium_programming_challenges array_transformations simulations",
    "urgency": 6.72,
    "parent": "",
  },

  {
    "title": "Next Closest Time",
    "description":
      "> Given a time represented in the format `HH:MM`, form the next closest time by reusing the current digits. There is no limit on how many times a digit can be reused.\n\n[spoiler]\n```python\ndef __use_binary_search(self, time: str) -> str:\n    numbers_set = set()\n    for i in [0, 1, 3, 4]:\n        for j in [0, 1, 3, 4]:\n            if time[i] < \"6\": numbers_set.add(\"\".join([time[i], time[j]]))\n    valid_numbers = list(numbers_set)\n    valid_numbers.sort() # So that we can binary search\n    hour, minutes = time.split(\":\")\n\n    # Fetch closest next time in current hour\n    N = len(valid_numbers)\n    i = bisect_right(valid_numbers, minutes)\n    if i < N: return \"\".join([hour, \":\", valid_numbers[i]])\n\n    # Fetch closest time the the next available hour\n    hour_cutoff_index = bisect_right(valid_numbers, \"23\")\n    i = bisect_right(valid_numbers, hour, hi=hour_cutoff_index)\n    if i == hour_cutoff_index: i = 0 # Wrap around (next day)\n    return \"\".join([valid_numbers[i], \":\", valid_numbers[0]])\n```\n",
    "tags": "binary_search medium_programming_challenges",
    "urgency": 6.47,
    "parent": "",
  },

  {
    "title": "Word Break",
    "description":
      "> Given a non-empty string `s` and a dictionary `wordDict` containing a list of non-empty words, determine if `s `can be segmented into a space-separated sequence of one or more dictionary words. Provide a recursive algorithm and a DP one as well.\n\n\n\n[spoiler]\n```python\ndef __use_bins(self, s: str, words: list) -> bool:\n    words_starting_with_char = defaultdict(list)\n    for word in words: words_starting_with_char[word[0]].append(word)\n    len_s = len(s)\n    cache = [None] * len_s\n\n    def __match(s_idx):\n        if s_idx == len_s: return True\n        if cache[s_idx] is not None: return cache[s_idx]\n        for word in words_starting_with_char[s[s_idx]]:\n            len_word = len(word)\n            if s_idx + len_word > len_s: continue\n            i = 0\n            while i < len_word and s_idx+i < len_s and word[i] == s[s_idx+i]: i += 1\n            if i == len_word and __match(s_idx + i): return True\n        cache[s_idx] = False\n        return False\n    return __match(0)\n\ndef __use_dp(self, s: str, words: list) -> bool:\n    word_set, len_s = set(words), len(s)\n    dp = [False] * (len_s + 1)\n    dp[0] = True # A str of length 0 can always be matched\n    for j in range(1, len_s+1):\n        for i in range(j):\n            if dp[i] and s[i:j] in word_set:\n                dp[j] = True\n                break\n    return dp[len_s]\n```\n",
    "tags":
      "string_processing medium_programming_challenges dynamic_programming recursive_algorithms",
    "urgency": 6.5,
    "parent": "",
  },

  {
    "title": "Conway's Game of Life",
    "description":
      "> Given a board with `m` by `n` cells, each cell has an initial state `live (1)` or `dead (0)`. Each cell interacts with its eight neighbors (horizontal, vertical, diagonal) using the following four rules (taken from the above Wikipedia article):\n* Any live cell with fewer than two live neighbors dies, as if caused by under-population.\n* Any live cell with two or three live neighbors lives on to the next generation.\n* Any live cell with more than three live neighbors dies, as if by over-population..\n* Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.\n\n> Write a function to compute the next state (after one update) of the board given its current state. The next state is created by applying the above rules simultaneously to every cell in the current state, where births and deaths occur simultaneously.\n\n* How do you implement this in place on the board? [Solution](https://github.com/dchege711/better_programmer/blob/chege_solutions/arrays/medium_game_of_life/game_of_life.py)\n\n* How would you implement the game on an infinite board?\n",
    "tags": "arrays medium_programming_challenges simulations",
    "urgency": 5.71,
    "parent": "",
  },

  {
    "title": "4 Steps for Probability",
    "description":
      "Describe an approach for computing the probability of an event.\n\n\n\n[spoiler]\n\n#### Find the sample space\n* Draw a tree if S isn't too large.\n* Make sure to encode all events that have some chance associated with them.\n* The experiment can be regarded as a walk from the root down to a leaf.\n\n#### From the leaves, define the events of interest\n* Don't be fooled by their frequency\n\n#### Determine the probabilities for each outcome\n* Edge-probabilities are determined by the assumptions made in the problem. These are open to interpretation.\n* The probability of an outcome is the product of all edge probabilities along the path from the root to the outcome. This is mechanical.\n\n#### Compute event probabilities\n* Remember, the probability of an event is the sum of the probabilities of the outcomes contained in that event.",
    "tags": "cos340 mathematics probability",
    "urgency": 5.89,
    "parent": "",
  },

  {
    "title": "Finding Duplicate Files in a System",
    "description":
      "> * Imagine you are given a real file system, how will you search files? DFS or BFS?\n* If the file content is very large (GB level), how will you modify your solution?\n* If you can only read the file by 1kb each time, how will you modify your solution?\n* What is the time complexity of your modified solution? What is the most time-consuming part and memory consuming part of it? How to optimize?\n* How to make sure the duplicated files you find are not false positive?",
    "tags": "medium_programming_challenges system_design",
    "urgency": 4.13,
    "parent": "",
  },

  {
    "title": "Word Break II",
    "description":
      "> Given a non-empty string `s` and a dictionary `wordDict` containing a list of non-empty words, add spaces in `s` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences. (What mistake did you make the first time? What did you learn?)\n\n\n\n* Try it on [LeetCode](https://leetcode.com/problems/word-break-ii/description/)\n\n\n\n[spoiler]\n* Form your recursion such that you can cache partial results. Not all traversals can help you cache!\n\n```python\ndef __recursive_word_break(self, s, words):\n    words_starting_with_char = defaultdict(set)\n    for word in words: words_starting_with_char[word[0]].add(word)\n    len_s, cache = len(s), defaultdict(list)\n\n    def __match_words(s_idx):\n        if s_idx == len_s: return None\n        if s_idx in cache: return cache[s_idx]\n        # Collect all complete word matches\n        matched_words = []\n        for word in words_starting_with_char[s[s_idx]]:\n            i = 0\n            while i < len(word) and s_idx + i < len_s and word[i] == s[s_idx+i]: i += 1\n            if i == len(word): matched_words.append(word)\n        # Collect all the sentences that match starting at s[s_idx]\n        sentences_from_s_idx = []\n        for word in matched_words:\n            next_sentences = __match_words(s_idx + len(word))\n            if next_sentences is not None:\n                for next_sentence in next_sentences:\n                    sentences_from_s_idx.append([word] + next_sentence)\n            else: sentences_from_s_idx.append([word])\n        cache[s_idx] = sentences_from_s_idx\n        return sentences_from_s_idx\n\n    __match_words(0)\n    complete_sentences = []\n    for sentence in cache[0]: # Returns empty list if 0 is absent\n        len_matches = 0\n        for word in sentence: len_matches += len(word)\n        if len_matches == len_s: complete_sentences.append(\" \".join(sentence))\n    return complete_sentences\n```\n",
    "tags":
      "hard_programming_challenges string_processing recursive_algorithms",
    "urgency": 8.48,
    "parent": "",
  },

  {
    "title": "Build Binary Tree from Serialization",
    "description":
      "> Given a serialized binary tree as an array, reconstruct the original binary tree, for instance:\n\n```markdown\n\nInput: [5,3,6,2,4,null,null,1]\nResult:\n\n       5\n      / \\\n     3   6\n    / \\\n   2   4\n  /\n 1\n```\n\n[spoiler]\n```python\ndef build_tree_from_level_order_serialization(values):\n    n = len(values)\n    if n == 0: return None\n    root = TreeNode(values[0])\n    previous_level_nodes = [root]\n    i = 1\n    while i < n:\n        current_level_nodes = []\n        prev_node_idx, append_left = 0, True\n        while i < n and prev_node_idx < len(previous_level_nodes):\n            parent_node = previous_level_nodes[prev_node_idx]\n            new_node = TreeNode(values[i]) if values[i] else None\n            if append_left:\n                parent_node.left = new_node\n                append_left = False\n            else:\n                parent_node.right = new_node\n                append_left = True\n                prev_node_idx += 1\n            current_level_nodes.append(new_node)\n            i += 1\n        previous_level_nodes = current_level_nodes\n    return root\n```\n",
    "tags": "arrays binary_trees",
    "urgency": 6.1,
    "parent": "",
  },

  {
    "title": "Fetching Elements with Given Rank in a Vanilla BST",
    "description":
      "> Given a binary search tree, write a function `kthSmallest` to find the `k`-th smallest element in it. Provide both a recursive and an iterative algorithm.\n\n[spoiler]\n```python\ndef __recursive_solution(self, root, k):\n    if k <= 0: raise ValueError(\"Order statistics are defined for k >= 1\")\n    self.num_visited = 0\n    self.kth_smallest = None\n\n    def __in_order_visit(node):\n        if node is None or self.kth_smallest: return\n        if node.left: __in_order_visit(node.left)\n        self.num_visited += 1\n        if self.num_visited == k: self.kth_smallest = node.val\n        if node.right: __in_order_visit(node.right)\n       \n    __in_order_visit(root)\n    return self.kth_smallest\n\ndef __iterative_solution(self, root, k):\n    stack, node = [], root\n    while node or stack:\n        while node:\n            stack.append(node) # Store the current node...\n            node = node.left # Explore its left child...\n        node = stack.pop() # Will be the most recent left child...\n        k -= 1\n        if k == 0: return node.val\n        node = node.right\n    return None\n\n```\n",
    "tags":
      "binary_search_trees medium_programming_challenges binary_trees order_statistics recursive_algorithms iterative_algorithms",
    "urgency": 5.75,
    "parent": "",
  },

  {
    "title": "Validate a Binary Search Tree",
    "description":
      "> Given a binary tree, return `true` if and only if the tree is a valid binary search tree.\n\n\n[spoiler]\n```python\ndef __recursive_test(self, root):\n    def __check(node, min_val, max_val):\n        if not node: return True\n        if node.val >= max_val or node.val <= min_val: return False\n        return __check(node.left, min_val, node.val) and __check(node.right, node.val, max_val)\n    return __check(root, -inf, inf)\n\ndef __use_in_order_traversal(self, root):\n    values = []\n    def __visit(node):\n        if not node: return\n        if len(values) >= 2 and values[-2] >= values[-1]: return\n        __visit(node.left)\n        values.append(node.val)\n        __visit(node.right)\n    __visit(root)\n    for i in range(1, len(values)):\n        if values[i-1] >= values[i]: return False\n    return True\n```\n",
    "tags":
      "binary_trees binary_search_trees medium_programming_challenges recursive_algorithms",
    "urgency": 6.99,
    "parent": "",
  },

  {
    "title": "Binary Search Tree Iterator",
    "description":
      "> Implement an iterator over a binary search tree. Your iterator will be initialized with the root node of a BST. `next()` and `hasNext()` should run in average \\(O(1)\\) time and uses \\(O(h)\\) memory\n\n[spoiler]\n```python\nclass BSTIterator(object):\n    def __init__(self, root):\n        self.stack = []\n        while root:\n            self.stack.append(root)\n            root = root.left\n\n    def hasNext(self): return len(self.stack) > 0\n\n    def next(self):\n        node = self.stack.pop()\n        x = node.right\n        while x:\n            self.stack.append(x)\n            x = x.left\n        return node.val\n```\n",
    "tags": "medium_programming_challenges binary_trees binary_search_trees",
    "urgency": 6.35,
    "parent": "",
  },

  {
    "title": "Find the Successor Node in a BST",
    "description":
      "> Search for the successor of node \\(x\\) (the node that comes right after \\(x\\) in the in-order walk) in \\(O(h)\\) time. Give two algorithms depending on whether the nodes have a `parent` attribute.\n\n\n\n[spoiler]\n\n* In case the nodes have pointers to their parents, we don't even need comparisons\n```c\nnode tree_successor(x) {\n    if (x.right != null) return tree_minimum(x.right);\n    // If there exists such a y, we find it by going up the tree until we encounter a left child\n    y = x.parent;\n    while (y != null && x == y.right) {x = y; y = y.parent; }\n    return y;\n}\n```\n\n* In case the tree nodes only have `left` and `right` attributes...\n```python\n\ndef __find_successor(self, root, p):\n    successor = None\n    while root:\n        if p.val < root.val:\n            successor = root\n            root = root.left\n        else: root = root.right\n    return successor\n```\n",
    "tags":
      "medium_programming_challenges binary_search_trees order_statistics",
    "urgency": 7.84,
    "parent": "",
  },

  {
    "title": "Question to ask someone when you want to get to know them better",
    "description":
      "[spoiler]\n\n* Can I see your browsing history?\n* If you could ask the universe one question and get the absolute truth, what would you want to know?\n* If you could take five non-replaceable personal artifacts on an intergalactic voyage, what would you take?\n* Which book/movie/song/animal do you hate? (Less frequently asked; more likely to get a genuine answer)\n* Do you pee in the shower?\n* What have you been into lately? How do you spend your time? (As opposed to *what do you do?*)\n* What’s your mother’s maiden name? What street did you grow up on? What’s the name of your first pet?\n* Use FORD (family occupation recreation dreams) because people like talking about that. Never RAPE them (religion abortion politics economy.\n\n",
    "tags": "reddit",
    "urgency": 5.9,
    "parent": "",
  },

  {
    "title": "Find the Key Closest to k in a BST",
    "description":
      "> Given a non-empty binary search tree and a target value, find the value in the BST that is closest to the target. The given target value is a floating point. You are guaranteed to have only one unique value in the BST that is closest to the target.\n\n\n[spoiler]\n* The closest key can either be identical, or the predecessor or the successor.\n\n```python\ndef closestValue(self, root, target):\n    closest_upper, closest_lower = inf, -inf\n    while root:\n        if root.val > target:\n            closest_upper = root.val\n            root = root.left\n        elif root.val < target:\n            closest_lower = root.val\n            root = root.right\n        else:\n            closest_lower = root.val\n            root = None\n               \n    if abs(closest_upper - target) < abs(target - closest_lower): return closest_upper\n    return closest_lower\n```\n",
    "tags": "binary_search_trees medium_programming_challenges",
    "urgency": 5.76,
    "parent": "",
  },

  {
    "title": "Find the Predecessor Node in a BST",
    "description":
      "> Search for the successor of node \\(x\\) (the node that comes right before \\(x\\) in the in-order walk) in \\(O(h)\\) time.\n\n[spoiler]\n```python\ndef __get_predecessor_no_parent(root, target_key):\n    predecessor, node = None, root\n    while node:\n        if target_key <= node.key: node = node.left\n        else:\n            predecessor = node\n            node = node.right\n    return predecessor\n```\n",
    "tags":
      "binary_search_trees order_statistics medium_programming_challenges",
    "urgency": 5.66,
    "parent": "",
  },

  {
    "title": "Find the K Closest Values in a BST",
    "description":
      "> Given a non-empty binary search tree and a target value, find `k` values in the BST that are closest to the target.\n\n[spoiler]\n```python\n\ndef get_k_closest_values(k, target):\n    predecessor = __get_node(target)\n    if not predecessor: predecessor = __get_predecessor(target)\n    successor = __get_successor(target)\n\n    closest_k_values = []\n    while len(closest_k_values) < k:\n        attach_predecessor, attach_successor = False, False\n        if predecessor and successor:\n            if abs(target - predecessor.val) < abs(successor.val - target): attach_predecessor = True\n            else: attach_successor = True\n        elif predecessor: attach_predecessor = True\n        elif successor: attach_successor = True\n\n        if attach_predecessor:\n            closest_k_values.append(predecessor.val)\n            predecessor = __get_predecessor(predecessor.val)\n        elif attach_successor:\n            closest_k_values.append(successor.val)\n            successor = __get_successor(successor.val)\n        else: break\n\n    return list(closest_k_values)\n```\n",
    "tags":
      "hard_programming_challenges binary_search_trees iterative_algorithms",
    "urgency": 6.75,
    "parent": "",
  },

  {
    "title": "Book Meeting Rooms",
    "description":
      "> Given an array of meeting time intervals consisting of start and end times `[[s1,e1],[s2,e2],...]` with \\(s_i < e_i\\), find the minimum number of conference rooms required. Provide two efficient algorithms.\n\n[spoiler]\n```python\ndef __two_pointers_implementation(self, intervals) -> int:\n    N = len(intervals)\n    start_times = sorted([interval.start for interval in intervals])\n    end_times = sorted([interval.end for interval in intervals])\n    max_rooms_needed, current_rooms_needed = 0, 0\n    start_times_idx, end_times_idx = 0, 0\n    while start_times_idx < N and end_times_idx < N:\n        if start_times[start_times_idx] < end_times[end_times_idx]:\n            current_rooms_needed += 1\n            start_times_idx += 1\n        else:\n            current_rooms_needed -= 1\n            end_times_idx += 1\n        if current_rooms_needed > max_rooms_needed:\n            max_rooms_needed = current_rooms_needed\n    return max_rooms_needed\n\ndef __priority_queue_implementation(self, intervals) -> int:\n    intervals = sorted(intervals, key=lambda interval: interval.start)\n    max_rooms_needed, end_times = 0, []\n    for interval in intervals:\n        start_time = interval.start\n        while end_times and end_times[0] <= start_time: heappop(end_times)\n        heappush(end_times, interval.end)\n        if len(end_times) > max_rooms_needed: max_rooms_needed = len(end_times)\n    return max_rooms_needed\n```\n",
    "tags":
      "medium_programming_challenges arrays priority_queues two_pointers range_search",
    "urgency": 6.24,
    "parent": "",
  },

  {
    "title": "Get the Next Permutation",
    "description":
      "> Implement next permutation, which rearranges numbers into the lexicographically next greater permutation of numbers. If such arrangement is not possible, it must rearrange it as the lowest possible order (ie, sorted in ascending order). The replacement must be in-place and use only constant extra memory.\n\n\n\n* Try it on [LeetCode](https://leetcode.com/problems/next-permutation/description/)\n\n\n\n[spoiler]\n```python\ndef __sample_solution(self, nums):\n    N = len(nums)\n    # Find the rightmost i s.t. nums[i] < nums[i+1]\n    i = N - 2\n    while i >= 0 and nums[i] >= nums[i+1]: i -= 1\n    if i >= 0: # If we found such an i...\n        j = N - 1 # ...let's get the smallest rightmost nums[j] that is still bigger than nums[i]\n        while j >= i+1 and nums[i] >= nums[j]: j -= 1\n        nums[i], nums[j] = nums[j], nums[i]\n    # nums[i+1:] is in descending order. Reverse to create smallest number\n    self.__reverse(nums, i+1)\n\ndef __reverse(self, nums, left):\n    right = len(nums) - 1\n    while left < right:\n        nums[left], nums[right] = nums[right], nums[left]\n        left += 1\n        right -= 1\n```\n",
    "tags": "medium_programming_challenges mathematics permutation",
    "urgency": 7.19,
    "parent": "",
  },

  {
    "title": "Number of Ways of Decoding a String",
    "description":
      "> A message containing letters from A-Z is being encoded to numbers using the following mapping: \\(A \\rightarrow 1, B \\rightarrow 2, ..., Z \\rightarrow 26\\). Given a non-empty string containing only digits, determine the total number of ways to decode it.\n\n\n[spoiler]\n* Remember, structure your recursion such that you can reuse partial results!\n\n```python\ndef __recursive_solution(self, s):\n    cache, len_s = {}, len(s)\n    def __num_decoding_ways(s_idx):\n        if s_idx == len_s: return 1 # We've found a valid decoding\n        if s_idx > len_s: return 0 # We're out of bounds\n        if s_idx in cache: return cache[s_idx]\n        num_ways = 0\n        if s[s_idx] != \"0\": num_ways += __num_decoding_ways(s_idx + 1)\n        if \"10\" <= s[s_idx:s_idx+2] <= \"26\": num_ways += __num_decoding_ways(s_idx+2)\n        cache[s_idx] = num_ways\n        return num_ways\n    return __num_decoding_ways(0)\n```\n",
    "tags":
      "string_processing medium_programming_challenges recursive_algorithms dynamic_programming",
    "urgency": 6.72,
    "parent": "",
  },

  {
    "title": "Generate All Valid Parentheses",
    "description":
      "> Given \\(n\\) pairs of parentheses, write a function to generate all combinations of well-formed parentheses.\n\n\n\n* [Practice on LeetCode](https://leetcode.com/problems/generate-parentheses/)\n\n\n[spoiler]\n```python\ndef __recursive_generation(self, n):\n    cache = {}\n    def __get_parentheses(num_left, num_right):\n        if (num_left, num_right) in cache: return cache[(num_left, num_right)]\n        if num_right < num_left or num_left < 0 or num_right < 0: return []\n        if num_left == 0 and num_right == 1: return [\")\"]\n\n        parentheses = []\n        for next_parentheses in __get_parentheses(num_left-1, num_right):\n            parentheses.append(\"\".join([\"(\", next_parentheses]))\n        for next_parentheses in __get_parentheses(num_left, num_right-1):\n            parentheses.append(\"\".join([\")\", next_parentheses]))\n\n        cache[(num_left, num_right)] = parentheses\n        return parentheses\n    return __get_parentheses(n, n)\n```\n",
    "tags":
      "medium_programming_challenges string_processing recursive_algorithms enumeration",
    "urgency": 7.64,
    "parent": "",
  },

  {
    "title": "Combination Sum",
    "description":
      "> Given a set of candidate numbers (candidates) (without duplicates) and a target number (target), find all unique combinations in candidates where the candidate numbers sums to target. The same repeated number may be chosen from candidates unlimited number of times.\n\n\n\n* Try on [LeetCode](https://leetcode.com/problems/combination-sum/description/)\n\n\n\n[spoiler]\n```python\ndef __recursive_with_memoization(self, candidates, target):\n    candidates.sort() # Allows us to stop early\n\n    def __collect_sum_elements(c_idx, deficit, cache):\n        if (c_idx, deficit) in cache: return cache[(c_idx, deficit)]\n\n        sum_elements = []\n        for idx in range(c_idx, len(candidates)):\n            current_pick = candidates[idx]\n            if current_pick < deficit:\n                next_elements = __collect_sum_elements(idx, deficit - current_pick, cache)\n                for elements in next_elements:\n                    sum_elements.append([current_pick] + elements)\n            elif current_pick == deficit: sum_elements.append([current_pick])\n            else: break\n\n        cache[(c_idx, deficit)] = sum_elements\n        return sum_elements\n\n    return __collect_sum_elements(0, target, {})\n```\n",
    "tags":
      "recursive_algorithms medium_programming_challenges dynamic_programming",
    "urgency": 7.18,
    "parent": "",
  },

  {
    "title": "Valid Parentheses",
    "description":
      "> Given a string containing just the characters `'(', ')', '{', '}', '[', ']'`, determine if the input string is valid. An input string is valid if:\n> * Open brackets must be closed by the same type of brackets.\n> * Open brackets must be closed in the correct order.\n> * An empty string is also considered valid.\n\n[spoiler]\n```python\ndef isValid(s):\n    opening_paren = set([\"(\", \"{\", \"[\"])\n    closing_paren = set([\")\", \"}\", \"]\"])\n    closing_to_opening = { \"]\": \"[\", \"}\": \"{\", \")\": \"(\" }\n\n    stack = []\n    for c in s:\n        if c in opening_paren: stack.append(c)\n        elif not stack: return False\n        elif stack.pop() != closing_to_opening[c]: return False\n\n    return len(stack) == 0\n```\n",
    "tags": "medium_programming_challenges string_processing",
    "urgency": 5.34,
    "parent": "",
  },

  {
    "title": "How do you flirt?",
    "description":
      "* Try to isolate myself and making sure the other person saw where I was going.\n\n* Talk to them. Empathize. Laugh. Don't one-up or try to solve their problems. Find out what their interests are, or what project they are involved in. And just listen.\n* Laugh at their jokes and try to make them laugh.\n* Establish physical contact when possible and suitable. Mirror body language.\n* Believe you're someone worth knowing and having fun with. Do something fun in your life so that you have something to talk about.\n\n* Be confident. Fake this too. Eventually you get good at it, you forget you're not confident any more.\n* Curling their hair takes a long time, getting their eyebrows plucked is painful, their makeup takes some meticulous effort. Compliment the things that they worked hard on.\n\n\n## Funny\n* Wink with your whole body. Out your hips and shoulder; step into it.\n* I don't; they speak to me and I run away. If they run after me, I know they're in.\n* Girl, are you retarded cause you're special to me.\n\n* A girl in high school told me I had beautiful eyes. My response was that maybe I should cut them out and give them to her. She never talked to me again.\n* How do you like your eggs in the morning? Fried or fertilized? (I'm vegan) Well call me salad and toss me off.\n* D - Demonstrate value E - Engage physically N - Nurture dependence N - Neglect emotionally I - Inspire hope S - Separate entirely\n* Fail at complimenting them and proceed to never talk to them again.\n* \"I'm awkward as fuck wanna go on a date?\"\n* I recently attempted to start a two-person book club. (What did you like about the Kama Sutra? Did you see any positions you want to try with anybody in the room?)",
    "tags": "reddit",
    "urgency": 5.97,
    "parent": "",
  },

  {
    "title": "Longest Valid Parentheses",
    "description":
      "> Given a string containing just the characters `'(', ')'`, find the length of the longest valid (well-formed) parentheses substring in linear time.\n\n[spoiler]\n```java\npublic int longestValidParentheses(String s, boolean debug) {\n    int maxLength = 0;\n    int dp[] = new int[s.length()];\n    for (int i = 1; i < s.length(); i++) {\n        if (s.charAt(i) == ')') { // We have ...)\n            if (s.charAt(i - 1) == '(') { // We have ...()\n                dp[i] = 2; // This we're guaranteed...\n                if (i >= 2) dp[i] += dp[i - 2]; // We might have ..(...)()\n            } else if (i - dp[i-1] - 1 >= 0 && s.charAt(i - dp[i-1] - 1) == '(') {\n                if (i - dp[i-1] - 2 >= 0) dp[i] = dp[i-1] + dp[i - dp[i-1] - 2] + 2;\n                else dp[i] = dp[i-1] + 2;\n            }\n            if (dp[i] > maxLength) maxLength = dp[i];\n        }\n    }\n    return maxLength;\n}\n```\n",
    "tags": "string_processing hard_programming_challenges dynamic_programming",
    "urgency": 10,
    "parent": "",
  },

  {
    "title": "Longest Substring with At Most K Unique Characters",
    "description":
      "> Given a string `s` , find the length of the longest substring `t`  that contains at most `k` distinct characters.\n\n\n\n* Practice on LeetCode: [Longest Substring with at most 2 Distinct Chars](https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/), [Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/)\n\n\n[spoiler]\n```python\ndef __linear_scan(self, s, max_unique_chars=2):\n    most_recent_idx, max_len, substr_start_idx = {}, 0, 0\n    for i, c in enumerate(s):\n        if c not in most_recent_idx and len(most_recent_idx) >= max_unique_chars:\n            char_to_remove, lowest_idx = None, inf\n            for char, char_idx in most_recent_idx.items():\n                if char_idx < lowest_idx:\n                    lowest_idx = char_idx\n                    char_to_remove = char\n            most_recent_idx.pop(char_to_remove)\n            substr_start_idx = lowest_idx + 1\n        most_recent_idx[c] = i\n        max_len = max(max_len, i - substr_start_idx + 1)\n    return max_len\n```\n",
    "tags":
      "hard_programming_challenges string_processing two_pointers sliding_window",
    "urgency": 8.18,
    "parent": "",
  },

  {
    "title": "School Tips",
    "description":
      "* Every day, he'd work 9-5. He was either in class, working on homework, or studying if he got everything done. At 5pm, he'd pack up his stuff and was done for the day.\n\n\n* Browse the textbook before the lecture, or at least skim the introduction and the section headings.\n\n\n* Quizlet is pretty great. Great for finding the entire tests for some reason.\n\n\n* If you need to participate in group discussion but aren't sure about the material, ask intelligent questions instead of trying to answer what you don't get.\n\n* [Library Genesis](http://gen.lib.rus.ec/)\n\n\n* Setup email forwards for university emails, this allows you to get student discounts with a valid university email way after your finish and they stop you accessing your account.\n\n* Your goal is to find the bathroom on campus that's used infrequently and find out when they clean it. When you find the perfect time and location, don't tell anyone until you graduate.\n\n* You've got to play the meta-game. If your lazy and unorganized like me, you won't have time to properly study for everything and complete every assignment. That's when you look at the grade distribution and start with the items that are worth the most.\n\n\n* Laminate your notes so the tears just roll off.\n\n[AskReddit: What is your best school life-hack?](https://old.reddit.com/r/AskReddit/comments/9iu47e/students_of_reddit_what_is_your_best_school/)\n",
    "tags": "reddit",
    "urgency": 0,
    "parent": "",
  },

  {
    "title": "Two-Sum and its Variants",
    "description":
      "> Determine the number of pairs of array elements that have a difference equal to a given \\(t\\)\n> How about finding two numbers on different indices that sum to \\(t\\)? Do this in \\(O(n)\\) time.\n\n[spoiler]\n## Part 1\n* Will sorting help? Yup, binary search. Does initial order matter? Nope!\n* If there are duplicates, store their counts and then get rid of duplicates. Remember to scale your answers accordingly.\n* For every element \\(a_i\\), binary search for \\(a_i - t\\). No need to search for \\(a_i + t\\) because if it exists, you'll find it as a pair later in your search. If we searched for \\(a_i + t\\) as well, we'll double count.\n\n## Part 2\n```python\n\ndef twoSum(self, nums, target):\n    map = {}\n    for i, num in enumerate(nums): map[num] = i # Overwrite with last entry           \n    for i, num in enumerate(nums):\n        other_needed = target - num\n        if other_needed in map and i != map[other_needed]: return [i, map[other_needed]]\n    return [None, None]\n```\n",
    "tags": "algorithms binary_search medium_programming_challenges",
    "urgency": 4.36,
    "parent": "",
  },

  {
    "title": "Find the Maximum Sum of Any Contiguous Subarray",
    "description":
      "> Find the contiguous subarray within a one-dimensional array of numbers which has the largest sum. Return this sum\n\n[spoiler]\n\n* [Kadane's Algorithm](https://en.wikipedia.org/wiki/Maximum_subarray_problem)\n\n## Intuition\n* Any solution will always have a last element \\(i\\). Thus, we simply have to examine, one by one, the set of solutions whose last element's index is \\(1\\), the set of solutions whose last element's index is \\(2\\), and so forth to \\(n\\).\n\n* Let \\(B_i\\) be the maximum subarray sum ending at position \\(i\\). Let \\(A_{i+1}\\) be the element at index \\(i+1\\).\n* Then \\(B_{i+1}\\) either includes \\(B_i\\) or it doesn't, equivalently, \\(B_{i+1} = max(A_{i+1}, A_{i+1} + B_i)\\)\n\n\n\n```python\ndef maxSubArray(self, nums):\n    max_ending_here = max_so_far = nums[0]\n    for x in nums[1:]:\n        max_ending_here = max(x, max_ending_here + x)\n        max_so_far = max(max_so_far, max_ending_here)\n    return max_so_far\n\n```\n",
    "tags":
      "dynamic_programming medium_programming_challenges arrays array_contiguous_elements",
    "urgency": 8.57,
    "parent": "",
  },

  {
    "title": "Check Cycle in a Linked List",
    "description":
      "> Check whether the provided linked list has a cycle or not.\n\n\n[spoiler]\n* One option is maintaining a set containing references already seen. If you see the same reference twice, viola!\n* What if you have to do it in \\(O(1)\\) space? Use the tortoise and the hare algorithm! The hare moves twice as fast. ([LeetCode Solution](https://leetcode.com/problems/linked-list-cycle/solution/))\n* If there's a cycle, the hare will eventually meet the tortoise. Why?\n  * Case A: The hare is just one step behind the tortoise. They'll meet each other in the next iteration.\n  * All other cases will reduce to case A after subsequent iterations. Convince yourself. :-/\n\n```java\n\npublic boolean hasCycle(ListNode head) {\n       \n        if (head == null || head.next == null) return false;\n        ListNode slow = head;\n        ListNode fast = head.next;\n       \n        while (slow != fast) {\n            if (fast == null || fast.next == null) return false;\n            slow = slow.next;\n            fast = fast.next.next;\n        }\n        return true;\n    }\n\n```\n* Read up more on [Wikipedia](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_Tortoise_and_Hare)\n",
    "tags": "easy_programming_challenges linked_lists two_pointers",
    "urgency": 5.83,
    "parent": "",
  },

  {
    "title": "Reverse an Integer",
    "description":
      "> Given a 32-bit signed integer, reverse digits of an integer. Return 0 if there is overflow. You can only use \\(O(1)\\) space.\n\n[spoiler]\n* Recall that a 32-bit signed integer ranges from -2,147,483,648 to 2,147,483,647\n```java\nprivate int useConstantSpace(int x) {\n    int rev = 0;\n    while (x != 0) {\n        int pop = x % 10;\n        x /= 10;\n        if (rev > Integer.MAX_VALUE/10 || (rev == Integer.MAX_VALUE / 10 && pop > 7)) return 0;\n        if (rev < Integer.MIN_VALUE/10 || (rev == Integer.MIN_VALUE / 10 && pop < -8)) return 0;\n        rev = rev * 10 + pop;\n    }\n    return rev;\n}\n```\n",
    "tags": "easy_programming_challenges iterative_algorithms",
    "urgency": 6.68,
    "parent": "",
  },

  {
    "title": "Check whether an integer is a palindrome",
    "description":
      "> Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward. Do not convert the integer into a string or char array.\n\n[spoiler]\n```java\nprivate boolean useConstantSpace(int x) {\n    // Negative numbers can't be palindrome\n    // Also if the last digit of the number is 0, the number must be zero in order to qualify.\n    if(x < 0 || (x % 10 == 0 && x != 0)) return false;\n\n    int revertedNumber = 0;\n    while(x > revertedNumber) { // Invert up to half the original number\n        revertedNumber = revertedNumber * 10 + x % 10;\n        x /= 10;\n    }\n\n    // When the length is an odd number, we can get rid of the middle digit by revertedNumber/10\n    return x == revertedNumber || x == revertedNumber/10;\n}\n```\n",
    "tags": "easy_programming_challenges iterative_algorithms",
    "urgency": 6.76,
    "parent": "",
  },

  {
    "title": "Move Zeroes to the End of the Array",
    "description":
      "> Given an array `nums`, write a function to move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.\n\n[spoiler]\n```python\ndef move_zeros_to_the_end(nums):\n    num_zeros = 0\n    for i, num in enumerate(nums):\n        if num == 0: num_zeros += 1\n        else: nums[i-num_zeros] = num\n       \n    for i in range(1, num_zeros+1): nums[-i] = 0\n```\n",
    "tags": "array_transformations easy_programming_challenges arrays",
    "urgency": 6.71,
    "parent": "",
  },

  {
    "title": "Greatest Subarray Product",
    "description":
      "> What is the greatest product of consecutive numbers in an array of numbers?\n\n\n[spoiler]\n\n```python\ndef maxProduct(self, nums):\n    return max(self._max_product(nums), self._max_product(list(reversed(nums))))\n\ndef _max_product(self, nums):\n    if len(nums) == 1: return nums[0]\n    max_product, running_product, positive_factor = -inf, -inf, -inf\n    for num in nums:\n        if num != 0:\n            if running_product == NEG_INF: running_product = 1\n            running_product *= num\n            if running_product > 0: positive_factor = running_product\n        else:\n            max_product = max(max_product, running_product, positive_factor, 0)\n            running_product, positive_factor = NEG_INF, NEG_INF\n\n    return max(max_product, running_product, positive_factor)\n```\n",
    "tags": "medium_programming_challenges arrays array_contiguous_elements",
    "urgency": 5.71,
    "parent": "",
  },

  {
    "title": "Regular Expression Matching",
    "description":
      "> Given an input string `s` and a pattern `p`, implement regular expression matching with support for '.' and '*'. The matching should cover the entire input string (not partial). `s` and/or `p` can be empty. Provide a recursive implementation and a DP implementation.\n\n[spoiler]\n```python\ndef __use_recursion(self, text, pattern):\n    if not pattern: return not text\n    first_match = bool(text) and pattern[0] in {text[0], '.'}\n    if len(pattern) >= 2 and pattern[1] == '*':\n        return (self.isMatch(text, pattern[2:]) or first_match and self.isMatch(text[1:], pattern))\n    return first_match and self.isMatch(text[1:], pattern[1:])\n\ndef __use_dp(self, text, pattern):\n    memo = {}\n    def dp(text_idx, pattern_idx, memo):\n        \"\"\" dp(i,j) is `True` only if `text[i:]` matches `pattern[j:]` \"\"\"\n        if (text_idx, pattern_idx) not in memo:\n            if pattern_idx == len(pattern): ans = text_idx == len(text)\n            else:\n                first_match = text_idx < len(text) and pattern[pattern_idx] in {text[text_idx], '.'}\n                if pattern_idx+1 < len(pattern) and pattern[pattern_idx+1] == '*':\n                    ans = dp(text_idx, pattern_idx+2) or first_match and dp(text_idx+1, pattern_idx)\n                else:\n                    ans = first_match and dp(text_idx+1, pattern_idx+1)\n            memo[text_idx, pattern_idx] = ans\n        return memo[text_idx, pattern_idx]\n    return dp(0, 0)\n```\n",
    "tags": "dynamic_programming recursive_algorithms string_processing",
    "urgency": 7.94,
    "parent": "",
  },

  {
    "title": "Diameter of Binary Tree",
    "description":
      "> Given a binary tree, you need to compute the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.\n\n[spoiler]\n```python\ndef __use_recursion(self, root):\n    num_nodes_on_longest_path = [1]\n\n    def get_depth(node):\n        if node is None: return 0          \n        left_depth = get_depth(node.left)\n        right_depth = get_depth(node.right)\n\n        max_num_nodes_on_path = left_depth + right_depth + 1\n        num_nodes_on_longest_path[0] = max(max_num_nodes_on_path, num_nodes_on_longest_path[0])\n        return max(left_depth, right_depth) + 1\n\n    get_depth(root)\n    return num_nodes_on_longest_path[0] - 1\n```\n",
    "tags": "binary_trees recursive_algorithms easy_programming_challenges",
    "urgency": 6.08,
    "parent": "",
  },

  {
    "title": "House Robber",
    "description":
      "> Given a list of non-negative integers representing the amount of money of each house, determine the maximum amount of money you can rob tonight without robbing from two adjacent houses.\n\n[spoiler]\n```python\ndef __linear_space_dp(self, houses):\n    N = len(houses)\n    def max_payoff(house_idx, cache):\n        if house_idx >= N: return 0\n        if house_idx not in cache:\n            current_payoff = max(\n                houses[house_idx] + max_payoff(house_idx + 2, cache),\n                max_payoff(house_idx + 1, cache)\n            )\n            cache[house_idx] = current_payoff\n         return cache[house_idx]\n    return max_payoff(0, {})\n\ndef __constant_space_dp(self, houses):\n    prev_max, current_max = 0, 0      \n    for value in houses:\n        temp = current_max\n        current_max = max(prev_max + value, current_max)\n        prev_max = temp\n    return current_max\n```\n",
    "tags":
      "dynamic_programming easy_programming_challenges array_search_under_constraints",
    "urgency": 8.52,
    "parent": "",
  },

  {
    "title": "Missing Number in a List",
    "description":
      "> Given a non-empty array of integers, every element appears twice except for one. Find that single one.\n\n[spoiler]\n* Since every element appears twice except one, we can use \\(missing\\_num = 2 * sum(unique\\_nums) - sum(nums)\\)\n* Alternatively, you can use a hash table. Counts are not necessary because max frequency is 2. Popping existing items will leave the singleton.\n* That's cool and all, but what about using \\(O(1)\\) space?\n* Recall the [associative, commutative, identity and self inverse properties](https://accu.org/index.php/journals/1915) of XOR...\n    * \\(a \\oplus 0 = a\\)\n    * \\(a \\oplus a = 0\\)\n    * \\(a \\oplus b \\oplus a = (a \\oplus a) \\oplus b = b\\)\n\n```python\ndef __use_constant_space(self, nums):\n    singleton = 0\n    for num in nums: singleton ^= num\n    return singleton\n```\n[LeetCode Source](https://leetcode.com/problems/single-number/solution/)\n",
    "tags":
      "easy_programming_challenges array_search_under_constraints bit_manipulation",
    "urgency": 7.38,
    "parent": "",
  },

  {
    "title": "Words with an Edit Distance of Less Than K",
    "description":
      "> Find all words from a dictionary that are \\(K\\) edit distance away from a given word.\n\n[spoiler]\n* Insight: If we have `kate`, `cats` and `cat` in our dictionary, we should extend the solution for `kate` & `cat` to `kate` & `cats`.\n\n```python\n# First insert all the words in the dictionary into a trie.\ndef search(word, maxCost):\n    currentRow = range( len(word) + 1 ) # build first row\n    results = []\n    for letter in trie.children: # recursively search each branch of the trie\n        searchRecursive(trie.children[letter], letter, word, currentRow, results, maxCost)\n    return results\n\n# This function assumes that the previousRow has been filled in already.\ndef searchRecursive(node, letter, word, previousRow, results, maxCost):\n    columns = len(word) + 1\n    currentRow = [ previousRow[0] + 1 ]\n    # Build one row for the letter, with a column for each letter in the target\n    # word, plus one for the empty string at column 0\n    for column in xrange(1, columns):\n        insertCost = currentRow[column - 1] + 1\n        deleteCost = previousRow[column] + 1\n        if word[column - 1] != letter: replaceCost = previousRow[column - 1] + 1\n        else: replaceCost = previousRow[column - 1]\n        currentRow.append(min(insertCost, deleteCost, replaceCost))\n\n    if currentRow[-1] <= maxCost and node.word != None:\n        results.append((node.word, currentRow[-1]))\n\n    # if any entries in the row are less than the maximum cost, then recursively search each branch of the trie\n    if min(currentRow) <= maxCost:\n        for letter in node.children:\n            searchRecursive(node.children[letter], letter, word, currentRow, results, maxCost)\n```\n[Source: Steve Hanov's Blog](http://stevehanov.ca/blog/index.php?id=114)\n",
    "tags":
      "hard_programming_challenges dynamic_programming string_processing tries recursive_algorithms edit_distance trees",
    "urgency": 8.83,
    "parent": "",
  },

  {
    "title": "String Permutations",
    "description":
      "> Print all permutations of a string keeping the sequence but changing cases. For instance, given `ABC`, output `abc Abc aBc ABc abC AbC aBC ABC`\n\n\n\n* Practice on [Geeks for Geeks](https://www.geeksforgeeks.org/permute-string-changing-case/)\n\n\n[spoiler]\n```python\ndef permute(word):\n    word = word.lower() # Standardize your starting conditions\n    n = len(word)\n    num_permutations = 1 << n # 2^n\n    for i in range(num_permutations):\n        combination = [c for c in word]\n        for j in range(n):\n            # If j-th bit is set, we convert it to upper case\n            if (((i >> j) & 1) == 1): combination[j] = word[j].upper()\n        print(\"\".join(combination))\n```\n",
    "tags":
      "string_processing medium_programming_challenges bit_manipulation enumeration permutation",
    "urgency": 6.78,
    "parent": "",
  },

  {
    "title": "Generate All Non-Zero Subarrays",
    "description":
      "> A subbarray is a contiguous part of array. Given an array, generate all non-empty subarrays.\n\n[spoiler]\n* Intuition: What are the possible starting and ending indices of the subarrays?\n* Note that this is a subset of generating all subsequences in the array where we need to pick elements using a bit array.\n```python\ndef get_subarrays(arr):\n    N, subarrays = len(arr), []\n    for start_idx in range(0, N):\n        for end_idx in range(start_idx, N):\n            subarrays.append(arr[start_idx: end_idx + 1])\n    return subarrays\n```\n* [Adapted from Geeks for Geeks: Subarray/Substring vs Subsequence and Programs to Generate them](https://www.geeksforgeeks.org/subarraysubstring-vs-subsequence-and-programs-to-generate-them/)\n",
    "tags": "easy_programming_challenges array_contiguous_elements arrays",
    "urgency": 7.6,
    "parent": "",
  },

  {
    "title": "My Calendar III",
    "description":
      "> A new event can always be added to your calendar. For each call to the method `MyCalendar.book`, return an integer `K` representing the largest integer such that there exists a K-booking in the calendar. A `K`-booking happens when `K` events have some non-empty intersection.\n\n\n[spoiler]\n```java\nclass MyCalendarThree {\n    /* Definitions and declarations of instance variables */\n    public MyCalendarThree() {\n        this.calendar = new TreeMap<>(new SortEventsByStartThenEnd());\n        this.max_concurrent_events = 0;\n    }\n    public int book(int new_event_start, int new_event_end) {\n        List<Integer> current_event_time = Arrays.asList(new_event_start, new_event_end);\n        // Get how many events occupy the exact same time...\n        int num_events_on_same_timeslot = 1;\n        if (this.calendar.containsKey(current_event_time)) {\n            num_events_on_same_timeslot += this.calendar.get(current_event_time).get(MULTIPLICITY_INDEX);\n        }\n        // Determine greatest endpoint that will be in the current event's left subtree...\n        int current_event_lower_max = new_event_end;\n        Entry<List<Integer>, List<Integer>> event_a = this.calendar.lowerEntry(current_event_time);\n        if (event_a != null && event_a.getValue().get(LOWER_MAX_INDEX) > new_event_end) {\n            current_event_lower_max = event_a.getValue().get(LOWER_MAX_INDEX);\n        }\n        this.calendar.put(current_event_time, Arrays.asList(num_events_on_same_timeslot, current_event_lower_max));\n\n        // Make event_a reference the earliest event that might overlap\n        event_a = this.calendar.ceilingEntry(current_event_time);\n        Entry<List<Integer>, List<Integer>> event_b = this.calendar.lowerEntry(current_event_time);\n        while (event_b != null && event_b.getValue().get(LOWER_MAX_INDEX) > new_event_start) {\n            event_a = event_b;\n            event_b = this.calendar.lowerEntry(event_a.getKey());\n        }\n\n        PriorityQueue<List<Integer>> overlapping_events = new PriorityQueue<>(new SortIntervalsByRightEnd());\n        int num_overlapping_events = 0;\n        while (event_a != null && event_a.getKey().get(START_INDEX) < new_event_end) {\n            overlapping_events.add(event_a.getKey());\n            num_overlapping_events += event_a.getValue().get(MULTIPLICITY_INDEX);\n\n            while (!overlapping_events.isEmpty() && event_a.getKey().get(START_INDEX) >= overlapping_events.peek().get(END_INDEX)) {\n                num_overlapping_events -= this.calendar.get(overlapping_events.remove()).get(MULTIPLICITY_INDEX);\n            }\n            if (num_overlapping_events > this.max_concurrent_events) this.max_concurrent_events = num_overlapping_events;\n            event_a = this.calendar.higherEntry(event_a.getKey());\n        }\n\n        // At this point, we definitely added the new event.\n        // There's a possibility that it's maximum endpoint can bubble up the tree\n        event_b = this.calendar.higherEntry(current_event_time);\n        while (event_b != null && event_b.getValue().get(LOWER_MAX_INDEX) < new_event_end) {\n            event_b.getValue().set(LOWER_MAX_INDEX, new_event_end);\n            this.calendar.put(event_b.getKey(), event_b.getValue());\n            event_b = this.calendar.higherEntry(event_b.getKey());\n        }\n        return this.max_concurrent_events;\n    }\n\n```\n",
    "tags":
      "binary_search_trees hard_programming_challenges interval_search_trees",
    "urgency": 7.86,
    "parent": "",
  },

  {
    "title": "Bi-Directional Search",
    "description":
      "> Given two words `beginWord ` and `endWord`, and a dictionary's word list, find the length of shortest transformation sequence from `beginWord` to `endWord`, such that only one letter can be changed at a time and each transformed word must exist in the word list. Note that `beginWord` is not a transformed word.\n\n\n* Practice: [LeetCode - Word Ladder](https://leetcode.com/problems/word-ladder/)\n\n\n\n[spoiler]\n* Insight: If \\(b\\) is the branching factor of the tree and \\(d\\) is the shortest distance, then vanilla BFS and DFS run in \\(O(b^d)\\), while bi-directional search runs in \\(O(b^{d/2} + b^{d/2})\\)\n```java\npublic int ladderLength(String beginWord, String endWord, List<String> wordList, boolean debug) {\n    HashSet<String> wordSet = new HashSet<>(wordList);\n    if (!wordSet.contains(endWord)) return 0;\n    HashSet<String> beginSet = new HashSet<>();\n    HashSet<String> endSet = new HashSet<>();\n    HashSet<String> visited = new HashSet<>();\n    int distance = 1;\n    int strLen = beginWord.length(); // All words have the same length\n    beginSet.add(beginWord);\n    endSet.add(endWord);\n    while (!beginSet.isEmpty() && !endSet.isEmpty()) {\n        // Switch by picking the smaller set...\n        if (beginSet.size() > endSet.size()) {\n            HashSet<String> set = beginSet; beginSet = endSet; endSet = set;\n        }\n        HashSet<String> temp = new HashSet<String>();\n        for (String word: beginSet) {\n            // In a limited alphabet, generation may trump exhaustive search\n            char[] wordChars = word.toCharArray();\n            for (int i = 0; i < wordChars.length; i++) {\n                for (char c = 'a'; c <= 'z'; c++) {\n                    char old = wordChars[i];\n                    wordChars[i] = c;\n                    String target = String.valueOf(wordChars);\n                    if (endSet.contains(target)) return distance + 1;\n                    if (!visited.contains(target) && wordSet.contains(target)) {\n                        temp.add(target); visited.add(target);\n                    }\n                    wordChars[i] = old;\n                }\n            }\n        }\n        beginSet = temp; distance++;\n    }\n    return 0;\n}\n```\n[Source: LeetCode discussion](https://leetcode.com/problems/word-ladder/discuss/40711/Two-end-BFS-in-Java-31ms.)\n",
    "tags":
      "breadth_first_search graph_algorithms medium_programming_challenges",
    "urgency": 6.83,
    "parent": "",
  },

  {
    "title": "Selection in an Unsorted Array",
    "description":
      "> Find the kth largest element in an unsorted array. Sorting the array then selecting the element takes \\(O(N\\ log\\ N)\\) time. Maintaining a PQ of size \\(k\\) gets the answer in \\(O(N\\ log\\ k)\\) time. Can you do \\(O(N)\\) time and \\(O(1)\\) space?\n\n[spoiler]\n* There is a version that guarantees \\(O(N)\\) time, but the constant is too high. This probabilistic implementation has a low constant, so tends to beat the guaranteed version.\n\n```java\nclass Solution {\n    public int useQuickSelect(int[] nums, int k) {\n        int n = nums.length;\n        return this.randomizedQuickSelect(nums, 0, n - 1, n - k + 1);\n    }\n    /* return the index of the i-th smallest number */\n    private int randomizedQuickSelect(int[] nums, int lo, int hi, int i) {\n        if (lo == hi) return nums[lo];\n        int randomIdx = lo + (int) (Math.random() * (hi - lo + 1)); // Randomize the partition for better average runtime\n        this.swap(nums, randomIdx, hi); // Define a method for swapping elements\n        int pivotIdx = this.partition(nums, lo, hi); // Define a method for partitioning the array around nums[hi]\n\n        int numElementsLeftPartition = pivotIdx - lo + 1;\n        if (numElementsLeftPartition == i) return nums[pivotIdx];\n        else if (i < numElementsLeftPartition) return this.randomizedQuickSelect(nums, lo, pivotIdx - 1, i);\n        return this.randomizedQuickSelect(nums, pivotIdx + 1, hi, i - numElementsLeftPartition);\n    }\n}\n```\n",
    "tags":
      "medium_programming_challenges order_statistics array_search_under_constraints arrays",
    "urgency": 7.05,
    "parent": "",
  },

  {
    "title": "Partitioning an Array",
    "description":
      "> Algorithms like Quicksort and Quickselect require a partition subroutine. Write a function that partitions an array around the last element. Recall that a partition is such that \\(arr[lo ... k-1] \\le arr[k] < arr[k+1 ... hi]\\)\n\n[spoiler]\n```java\npublic int partition(int[] nums, int lo, int hi) {\n    int pivotElement = nums[hi], i = lo - 1;\n    for (int j = lo; j < hi; j++) {\n        if (nums[j] <= pivotElement) {\n            i += 1;\n            this.swap(nums, i, j);\n        }\n    }\n    this.swap(nums, i + 1, hi);\n    return i + 1;\n}\n```\n",
    "tags": "medium_programming_challenges sorting array_transformations",
    "urgency": 7.11,
    "parent": "",
  },

  {
    "title": "Fast Exponentiation by Squaring",
    "description":
      "> Write an iterative algorithm for calculating \\(x^n\\). [LeetCode link](https://leetcode.com/problems/powx-n/description/)\n\n[spoiler]\n```java\npublic double myPow(double x, int n) {\n    long N = n;\n    if (N < 0) { x = 1 / x; N = -N; }\n    double ans = 1, current_product = x;\n    for (long i = N; i > 0; i /= 2) {\n        if ((i % 2) == 1) ans = ans * current_product;\n        current_product = current_product * current_product;\n    }\n    return ans;\n}\n\n```\n* [LeetCode discussion on the iterative algorithm](https://leetcode.com/problems/powx-n/solution/)\n",
    "tags": "iterative_algorithms mathematics medium_programming_challenges",
    "urgency": 6.34,
    "parent": "",
  },

  {
    "title": "Exactly One Edit Distance Away",
    "description":
      "> Given two strings `s` and `t`, determine if they are both one edit distance apart.\n\n\n* Note: Using the edit distance algorithm is too slow. To exit early, you'd need some code-fu.\n* Try it on [LeetCode](https://leetcode.com/problems/one-edit-distance/description/)\n\n\n[spoiler]\nThere are only 3 ways of satisfying the one-edit constraint:\n* Replace 1 char\n* Delete 1 char from s\n* Delete 1 char from t\n```python\ndef one_edit_distance_away(self, s, t):\n    if len(s) > len(t): s, t = t, s # Let s be the shorter string to reduce number of cases\n    len_s, len_t = len(s), len(t)\n    for idx in range(len_s):\n        if s[idx] != t[idx]: # You only get one shot\n            if len_s == len_t: return s[idx+1:] == t[idx+1:] # Do a substitution\n            return s[idx:] == t[idx+1:] # Do a deletion.\n    return len_t - len_s == 1\n```\n* Adapted from [/u/Cheng_Zhang's submission on LeetCode](https://leetcode.com/problems/one-edit-distance/discuss/50098/My-CLEAR-JAVA-solution-with-explanation)",
    "tags": "string_processing medium_programming_challenges edit_distance",
    "urgency": 6.99,
    "parent": "",
  },

  {
    "title": "Lowest Common Ancestor",
    "description":
      "> Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree. Use \\(O(1)\\) space. Follow up: what if you're given a binary search tree?\n\n\n\n* Practice: [LCA in a BT (LeetCode)](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/), [LCA in a BST (LeetCode)](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree)\n\n[spoiler]\n* If we were allowed \\(O(n)\\) space, then fetching the paths to the two nodes then examining them would work.\n```python\ndef lca_binary_tree(self, root, p, q):\n    if root is None or root.val == p.val or root.val == q.val: return root\n    left_node = self.lca_binary_tree(root.left, p, q)\n    right_node = self.lca_binary_tree(root.right, p, q)\n    if left_node is not None and right_node is not None: return root\n    if left_node is not None: return left_node\n    return right_node\n\ndef lca_binary_search_tree(self, root, p, q):\n    while root:\n        if root.val > p.val and root.val > q.val: root = root.left\n        elif root.val < p.val and root.val < q.val: root = root.right\n        else: return root\n    return None\n```\n* As explained in this [blog post](http://blog.gainlo.co/index.php/2016/07/06/lowest-common-ancestor/) and implemented by [/u/yuhangjiang on LeetCode](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/discuss/65226/My-Java-Solution-which-is-easy-to-understand)\n",
    "tags": "medium_programming_challenges recursive_algorithms binary_trees",
    "urgency": 6.99,
    "parent": "",
  },

  {
    "title": "Questions to Explore",
    "description":
      "* Why is my `left_binary_search()` way slower than `left_bisect`?\n\n* Efficient GCD algorithms\n\n* Solving Candy in [\\(O(n)\\) time and \\(O(1)\\) space](https://leetcode.com/problems/candy/solution/#)\n\n* Finding the Median of two sorted arrays of lengths \\(m\\) and \\(n\\) in \\(O(lg(n+m))\\) time.\n\n* How are solid objects made transparent in videos, e.g. [this instructor's hand](https://www.youtube.com/watch?v=kw9R0nD69OU)?\n\n* Find the number of connected components in a graph using a Union Find data structure.\n\n* Implement Sedgewick's Newton method for square roots. Generalize it.\n\n* How do I efficiently solve the ticket reselling problem on HackerRank? PQ and hash map implementations are both too slow.\n\n* Implement Conway's Game of Life for an infinite board.\n\n* When are pre-order and post-order traversals of BSTs useful? (Skienna, pg. 80)\n\n* Fix the `build_tree_from_level_order_serialization()` in the binary tree utility.\n\n* Go through the complexity analysis and the closure number solution for [LeetCode's Generating Parentheses](https://leetcode.com/problems/generate-parentheses/solution/)\n\n* Revisit the DP solution for [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/description/)\n\n* Implement the in-place algorithm for [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/)\n\n* Revisit the Fibonacci algorithms for the [Climbing Stairs Problem](https://leetcode.com/problems/climbing-stairs/solution/)\n\n* Revisit [/u/cbmbbz's solution](https://leetcode.com/problems/permutations-ii/discuss/18602/9-line-python-solution-with-1-line-to-handle-duplication-beat-99-of-others-%3A-) for generating permutations\n\n* Learn how to solve [Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction/)\n\n* Implement the [DP algorithm](https://leetcode.com/problems/minimum-height-trees/discuss/76052/Two-O(n)-solutions) and the [node elimination algorithm](https://leetcode.com/problems/minimum-height-trees/discuss/76055/Share-some-thoughts) for solving the [Minimum Height Trees problem](https://leetcode.com/problems/minimum-height-trees/)\n\n\n* Revisit the [binary search solution](https://leetcode.com/problems/longest-increasing-subsequence/) for the Longest Increasing Subsequence problem.\n\n\n* Revisit the [Segment Tree Solution](https://leetcode.com/problems/number-of-longest-increasing-subsequence/solution/#) for Number of Longest Increasing Subsequences.\n",
    "tags": "to_do_list",
    "urgency": 10,
    "parent": "",
  },

  {
    "title": "Innocent Questions to Avoid",
    "description":
      "* \"Oh, are you going as Two-Face for Halloween?\" I had just found out I had Bells Palsy.\n* Audience member after a performance: “Were you wearing a fat suit under your costume?” I was not.\n* My 3rd grade teacher asked me why I don't sit with my friends at lunch. I told her it was because I didn't have any.\n* Made friends at college/class yet?\n* A lady asked my wife “why don’t you have any kids? You’d be a great mom.” After we’d been trying to get pregnant for 2 years.\n* \"Why don't you wear makeup?\" ...I do.\n* This girl in college said \"Do you think your roommate likes me? Can you find out?\" I had a crush on her.\n\n* My relatives love asking why I picked my particular career field and “Why didn’t you go to school for something useful, like nursing?”\n* Waiter: \"Will anyone else be joining you tonight?\" Nah, but thanks for reminding me.\n* How far along are you? My first day back to work 5 weeks after having my baby. I cried so hard.\n* \"When are you graduating?\" I'll do ya one better - \"what are your plans after you graduate?\"\n* So tell me about yourself. What are your hobbies? You know, what do you like to do?\n* Whenever someone I haven't seen in a while says \"How are things with you?\" Instead of saying \"Well, I'm 33, single, living in a shitty, small 1 bedroom apartment while I watch my dog die of old age and work for a miserable company that I hate...\" I just say \"Oh, really good! :)\"\n* How have you been single for so long? My only answer is that I just haven't met anyone that I'm interested in but idk.. it still makes me feel bad to think about it.\n* When I was unemployed \"so what do you do?\" was almost enough to bring me to tears.\n\n* At a reunion, being asked what I am doing now, what I had been up to these years.\n* \"What is your life goal?\" Crushed so much, I needed to go on disability.\n* \"How does it feel to be compared to your older brother?\"\n\n\n* [AskReddit thread](https://old.reddit.com/r/AskReddit/comments/9mpglj/what_innocent_question_has_someone_asked_you_that/)\n",
    "tags": "reddit",
    "urgency": 4.93,
    "parent": "",
  },

  {
    "title": "Key Properties of Linear Filters",
    "description":
      "> Describe 7 key properties of linear filters. What are the implications of these properties? Give some examples of linear filters.\n\n[spoiler]\n\n* Linearity: \\(filter(f_1 + f_2) = filter(f_1) + filter(f_2)\\)\n* Shift Invariance: `filter(shift(f)) = shift(filter(f))`\n* Commutative: \\(a * b = b * a\\)\n* Associative: \\(a * (b * c) = (a * b) * c\\)\n* Distributive: \\(a * (b + c) = (a * b) + (a * c)\\)\n* Scalars factor out: \\(ka * b = a * kb = k(a * b)\\)\n* The unit impulse \\(e = [..., 0, 0, 1, 0, 0, ...]\\) is the identity, i.e. \\(a * e = a\\)\n\n## Implications\n* Shift invariance - same behavior regardless of pixel location; any linear shift-invariant operator can be represented as a convolution.\n* Commutativeness implies there's no conceptual difference between filter and signal.\n* Associativeness means instead of \\((((a * b_1) * b_2) * b_3)\\), we can apply one filter \\(a * (b_1 * b_2 * b_3)\\)\n",
    "tags": "cos429 mathematics image_processing",
    "urgency": 5.66,
    "parent": "",
  },

  {
    "title": "What are these image filters good at?",
    "description":
      "> \\(\\begin{bmatrix} 0\\ 0\\ 0\\\\ 0\\ 1\\ 0\\\\ 0\\ 0\\ 0 \\end{bmatrix}\\), \\(\\begin{bmatrix} 0\\ 0\\ 0\\\\ 0\\ 0\\ 1\\\\ 0\\ 0\\ 0 \\end{bmatrix}\\), \\(\\frac{1}{9}\\begin{bmatrix} 1\\ 1\\ 1\\\\ 1\\ 1\\ 1\\\\ 1\\ 1\\ 1 \\end{bmatrix}\\), \\(\\left(\\begin{bmatrix} 0\\ 0\\ 0\\\\ 0\\ 2\\ 0\\\\ 0\\ 0\\ 0 \\end{bmatrix} - \\frac{1}{9}\\begin{bmatrix} 1\\ 1\\ 1\\\\ 1\\ 1\\ 1\\\\ 1\\ 1\\ 1 \\end{bmatrix}\\right)\\)\n\n[spoiler]\n* \\(\\begin{bmatrix} 0\\ 0\\ 0\\\\ 0\\ 1\\ 0\\\\ 0\\ 0\\ 0 \\end{bmatrix} \\rightarrow \\) no change\n* \\(\\begin{bmatrix} 0\\ 0\\ 0\\\\ 0\\ 0\\ 1\\\\ 0\\ 0\\ 0 \\end{bmatrix} \\rightarrow \\) shift left by 1 pixel\n* \\(\\frac{1}{9}\\begin{bmatrix} 1\\ 1\\ 1\\\\ 1\\ 1\\ 1\\\\ 1\\ 1\\ 1 \\end{bmatrix} \\rightarrow \\) blur with a box filter\n\n* \\(\\left(\\begin{bmatrix} 0\\ 0\\ 0\\\\ 0\\ 2\\ 0\\\\ 0\\ 0\\ 0 \\end{bmatrix} - \\frac{1}{9}\\begin{bmatrix} 1\\ 1\\ 1\\\\ 1\\ 1\\ 1\\\\ 1\\ 1\\ 1 \\end{bmatrix}\\right) \\rightarrow \\) sharpening filter\n",
    "tags": "cos429 image_processing",
    "urgency": 5.44,
    "parent": "",
  },

  {
    "title": "Possible Coin Change Denominations",
    "description":
      "> You are given coins of different denominations. Return the number of combinations that make up a given amount of money. Assume that you have infinite number of each kind of coin.\n\n* [Try it on LeetCode](https://leetcode.com/problems/coin-change-2/description/)\n\n[spoiler]\n```python\ndef change(self, desired_amount, available_coins):\n    num_combinations = [0] * (desired_amount + 1)\n    num_combinations[0] = 1\n    for coin in available_coins:\n        for amount in range(coin, desired_amount + 1):\n            num_combinations[amount] += num_combinations[amount - coin]\n    return num_combinations[desired_amount]\n```\n* [A recursive implementation is way slower](https://github.com/dchege711/better_programmer/tree/chege_solutions/dynamic_programming/coin_change). It times out on LeetCode's OJ\n",
    "tags": "dynamic_programming medium_programming_challenges",
    "urgency": 9.03,
    "parent": "",
  },

  {
    "title": "Spiral Matrix",
    "description":
      "> Given a matrix with \\(m\\) rows and \\(n\\) columns, return all elements of the matrix in spiral order. For instance, \\(\\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{bmatrix}\\) outputs \\(1,2,3,6,9,8,7,4,5\\)\n\n* Practice on [LeetCode](https://leetcode.com/problems/spiral-matrix/description/)\n\n[spoiler]\n```python\ndef __follow_spiral_path(matrix):\n    # Insert code to find NUM_ROWS and NUM_COLS, or to return [] if matrix is empty\n\n    def move_in_spiral(r_top, r_bottom, c_left, c_right):\n        for c_idx in range(c_left, c_right+1): yield matrix[r_top][c_idx]\n        for r_idx in range(r_top + 1, r_bottom + 1): yield matrix[r_idx][c_right]\n        if r_top < r_bottom and c_left< c_right:\n            for c_idx in range(c_right - 1, c_left - 1, -1): yield matrix[r_bottom][c_idx]\n            for r_idx in range(r_bottom - 1, r_top, -1): yield matrix[r_idx][c_left]\n\n    left_col_idx, right_col_idx = 0, NUM_COLS - 1\n    top_row_idx, bottom_row_idx = 0, NUM_ROWS - 1\n    elements_on_path = []\n    while left_col_idx <= right_col_idx and top_row_idx <= bottom_row_idx:\n        for element in move_in_spiral(top_row_idx, bottom_row_idx, left_col_idx, right_col_idx):\n            elements_on_path.append(element)\n        left_col_idx += 1\n        right_col_idx -= 1\n        top_row_idx += 1\n        bottom_row_idx -= 1\n    return elements_on_path\n```\n",
    "tags":
      "medium_programming_challenges arrays iterative_algorithms generators",
    "urgency": 6.05,
    "parent": "",
  },

  {
    "title": "Generate Unique Permutations from Possibly Duplicate Elements",
    "description":
      "> Given a collection of numbers that might contain duplicates, return all possible unique permutations. For instance, given \\([1, 1, 2]\\), return \\([1, 1, 2], [1, 2, 1], [2, 1, 1] \\)\n\n\n\n* Practice on [LeetCode](https://leetcode.com/problems/permutations-ii/description/)\n\n\n\n[spoiler]\n* Adapted from [/u/cbmbbz on LeetCode](https://leetcode.com/problems/permutations-ii/discuss/18602/9-line-python-solution-with-1-line-to-handle-duplication-beat-99-of-others-%3A-)\n\n```python\ndef __build_in_parallel(self, nums):\n    unique_permutations = [[]]\n    for n in nums:\n        updated_unique_permutations = []\n        # For each of the lists that we have so far...\n        for partial_list in unique_permutations:\n            len_partial_list = len(partial_list)\n            # Make more lists by inserting n into every possible index\n            for i in range(len_partial_list + 1):\n                updated_unique_permutations.append(partial_list[:i] + [n] + partial_list[i:])\n                # any other slot after the first occurrence can be thought as the duplicate of the\n                # first occurrence as the inserted element and the slot being the existing one.\n                if i < len_partial_list and partial_list[i] == n: break\n        unique_permutations = updated_unique_permutations\n    return unique_permutations\n```\n",
    "tags":
      "medium_programming_challenges iterative_algorithms enumeration permutation",
    "urgency": 8.98,
    "parent": "",
  },

  {
    "title": "Combinations",
    "description":
      "> Given two integers \\(n\\) and \\(k\\), return all possible combinations of \\(k\\) numbers out of  \\(1 ... n\\).\n\n* Practice on [LeetCode](https://leetcode.com/problems/combinations/)\n\n[spoiler]\n```python\ndef __brute_force(self, n, k): # 680ms on Online Judge\n    list_combinations = []\n    def collect(current_num, partial_list):\n        len_partial_list = len(partial_list)\n        if len_partial_list == k: list_combinations.append(partial_list[:]) # Don't copy a reference\n        if len_partial_list >= k: return\n        for i in range(current_num, n+1): # Append-recurse-pop is faster than passing in a new array\n            partial_list.append(i); collect(i+1, partial_list); partial_list.pop()  \n    collect(1, [])\n    return list_combinations\n   \ndef __use_backtracking(self, n, k): # 128ms on Online Judge\n    list_combinations, partial_list, x = [], [], 1\n    while True:\n        l = len(partial_list)\n        if l == k: list_combinations.append(partial_list[:])\n        if l == k or n - x + 1 < k - l: # The 2nd condition == not enough numbers left to append\n            if not partial_list: return list_combinations\n            x = partial_list.pop() + 1\n        else:\n            partial_list.append(x); x += 1\n```\n* The backtracking solution was obtained from [/u/dietpepsi on LeetCode discussion forum](https://leetcode.com/problems/combinations/discuss/27029/AC-Python-backtracking-iterative-solution-60-ms)",
    "tags":
      "permutations_and_combinations medium_programming_challenges iterative_algorithms backtracking",
    "urgency": 7.63,
    "parent": "",
  },

  {
    "title": "Palindrome Permutation II",
    "description":
      "> Given a string `s`, return all the palindromic permutations (without duplicates) of it. If no palindromes can be formed, return the empty string.\n\n* Try it on [LeetCode](https://leetcode.com/problems/palindrome-permutation-ii/)\n\n[spoiler]\n* Generating all possible permutations then checking if palindrome is too slow!\n```python\ndef __only_generate_palindromes(self, s):\n    len_s, char_count, middle_char = len(s), defaultdict(lambda: 0), \"\"\n    for c in s: char_count[c] += 1\n    for c, count in char_count.items(): # Check that palindromes can be formed\n        if count % 2 == 1:\n            if middle_char is None: middle_char = c\n            else: return []\n\n    def collect_palindromes(partial_palindrome, palindromes):\n        if len(partial_palindrome) == len_s // 2:\n            palindromes.append(\"\".join(list(reversed(partial_palindrome)) + [middle_char] + partial_palindrome))\n            return palindromes\n        for c in char_count:\n            if char_count[c] >= 2:\n                char_count[c] -= 2 # Don't pop anything off the dict lest you mess up iteration order!                      \n                collect_palindromes(partial_palindrome + [c], palindromes)\n                char_count[c] += 2\n        return palindromes\n\n    return collect_palindromes([], [])\n```\n",
    "tags":
      "string_processing recursive_algorithms medium_programming_challenges",
    "urgency": 6.93,
    "parent": "",
  },

  {
    "title": "Check Valid Tree",
    "description":
      "> Given `n` nodes labeled from `0` to `n-1` and a list of undirected edges (each edge is a pair of nodes), write a function to check whether these edges make up a valid tree.\n\n\n* Practice on [LeetCode](https://leetcode.com/problems/graph-valid-tree)\n\n\n\n[spoiler]\n* When running DFS to check for cycles, remember to pass a pointer to the parent.\n\n```python\ndef check_valid_tree(self, n, edges):\n    G = defaultdict(set)\n    for node_a, node_b in edges:\n        G[node_a].add(node_b)\n        G[node_b].add(node_a)\n    visited = set()\n    def has_no_cycle(node_id, parent_id):\n        if node_id in visited: return False\n        visited.add(node_id)\n        for neighbor_id in G[node_id]:\n            if neighbor_id != parent_id:\n                if not has_no_cycle(neighbor_id, node_id): return False\n        return True\n    if not has_no_cycle(0, 0): return False # A tree must not have any cycles\n    return len(visited) == n # A tree must have a single connected component\n\n```\n",
    "tags":
      "graph_algorithms depth_first_search medium_programming_challenges trees",
    "urgency": 6.02,
    "parent": "",
  },

  {
    "title": "Minimum Height Tree",
    "description":
      "> For a undirected graph with tree characteristics, we can choose any node as the root. Among all possible rooted trees, those with minimum height are called minimum height trees (MHTs). Given such a graph, write a function to find all the MHTs and return a list of their root labels.\n\n\n* Practice on [LeetCode](https://leetcode.com/problems/minimum-height-trees/)\n\n\n[spoiler]\n\n```python\ndef __infer_from_longest_path(self, n, edges):\n    # [Omitted code] Construct graph G using an adjacency list representation\n\n    def get_longest_path():\n      \n        def longest_path_from_node(node_id):\n            NOT_VISITED = -1\n            prev_node_on_path = [NOT_VISITED for _ in range(n)]\n            prev_node_on_path[node_id] = node_id\n            nodes_to_process, farthest_nodes, distance = [node_id], [], 0\n            while nodes_to_process:\n                next_nodes = []\n                for node_id in nodes_to_process:\n                    for next_node_id in G[node_id]:\n                        if prev_node_on_path[next_node_id] == NOT_VISITED:\n                            next_nodes.append(next_node_id)\n                            prev_node_on_path[next_node_id] = node_id\n                distance += 1\n                farthest_nodes = nodes_to_process; nodes_to_process = next_nodes\n            longest_path = []\n            node_id = farthest_nodes[0] # Any such node...\n            while prev_node_on_path[node_id] != node_id:\n                    longest_path.append(node_id); node_id = prev_node_on_path[node_id]\n            longest_path.append(node_id)\n            return longest_path\n\n        return longest_path_from_node(longest_path_from_node(0)[0])\n\n    longest_path = get_longest_path()\n    mid_node_id = len(longest_path) // 2\n    if len(longest_path) % 2 == 0: return longest_path[mid_node_id-1:mid_node_id+1]\n    return [longest_path[mid_node_id]]\n```\n",
    "tags":
      "graph_algorithms breadth_first_search trees medium_programming_challenges",
    "urgency": 6.72,
    "parent": "",
  },

  {
    "title": "Selecting K Random Elements",
    "description":
      "> Efficiently and randomly select \\(k\\) elements from a list. Follow-up, what if the length of the list isn't known beforehand?\n\n[spoiler]\n* Repeatedly picking a random element is slow because in some round, you might pick an already picked element and have to repeat that round.\n* An alternative option is to shuffle the list \\(O(N)\\), then pick the first \\(k\\) items. But this doesn't work for unbounded lists.\n* For both bounded and unbounded lists, reservoir sampling works well.\n* Each element in the stream has a [probability of \\(k/n\\) of being included in the reservoir](https://en.wikipedia.org/wiki/Reservoir_sampling).\n* The wiki page also describes a distributed algorithm when \\(k\\) is too large to fit in one machine.\n\n```python\ndef reservoir_sampling(stream, k):\n    # Initialize the reservoir with the first k items\n    reservoir = []\n    for _ in range(k):\n        try: reservoir.append(next(stream))\n        except StopIteration: return reservoir  \n\n    num_elements_viewed = k   \n    while True:\n        try: element = next(stream)\n        except StopIteration: return reservoir\n        j = randint(0, num_elements_viewed) # Includes both ends\n        if j < k: reservoir[j] = element\n        num_elements_viewed += 1\n  \n    return reservoir\n```\n",
    "tags": "medium_programming_challenges probability sampling",
    "urgency": 7.29,
    "parent": "",
  },

  {
    "title": "Longest Common Subsequence",
    "description":
      "> Given two sequences of integers, return the longest common subsequence. If there are multiple valid solutions, return any of them.\n\n\n* Practice on [HackerRank](https://www.hackerrank.com/challenges/dynamic-programming-classics-the-longest-common-subsequence/problem)\n\n[spoiler]\n```python\ndef longest_common_subsequence(seq_a, seq_b):\n    seq_a, seq_b = [\"#\"] + seq_a, [\"#\"] + seq_b\n    NUM_ROWS, NUM_COLS = len(seq_a), len(seq_b)\n           \n    # The top-most row and left-most col should be all zeros because LCS w/ empty array is 0\n    dp = [[] for _ in range(NUM_ROWS)]\n    for r in range(NUM_ROWS): dp[r] = [0 for _ in range(NUM_COLS)]\n\n    for r in range(1, NUM_ROWS):\n        for c in range(1, NUM_COLS):\n            if seq_a[r] == seq_b[c]: dp[r][c] = dp[r-1][c-1] + 1\n            else: dp[r][c] = max(dp[r-1][c], dp[r][c-1])\n    # At this point, dp[NUM_ROWS-1][NUM_COLS-1] == length(LCS)\n\n    def backtrack(r, c):\n        if r == 0 or c == 0: return []\n        if seq_a[r] == seq_b[c]: return backtrack(r-1, c-1) + [seq_a[r]]\n        if dp[r][c-1] > dp[r-1][c]: return backtrack(r, c-1)\n        return backtrack(r-1, c)\n   \n    return backtrack(NUM_ROWS-1, NUM_COLS-1)\n```\n* Adapted from Wikipedia: [Longest Common Subsequence Problem](https://en.wikipedia.org/wiki/Longest_common_subsequence_problem#Computing_the_length_of_the_LCS)\n",
    "tags":
      "medium_programming_challenges dynamic_programming edit_distance subsequence_algorithms",
    "urgency": 7.57,
    "parent": "",
  },

  {
    "title": "Decomment C++ Source Code",
    "description":
      "> Given a C++ program, remove comments from it. There will be no control characters, single quote, or double quote characters. It is guaranteed that every open block comment will eventually be closed, so `/*` outside of a line or block comment always starts a new comment. Finally, implicit newline characters can be deleted by block comments.\n\n* Practice on [LeetCode](https://leetcode.com/problems/remove-comments/)\n\n[spoiler]\n```python\ndef remove_comments(self, source):\n    in_block, ans = False, []\n    for line in source:\n        i = 0\n        if not in_block: newline = []\n        while i < len(line):\n            if line[i:i+2] == '/*' and not in_block:\n                in_block = True\n                i += 1\n            elif line[i:i+2] == '*/' and in_block:\n                in_block = False\n                i += 1\n            elif not in_block and line[i:i+2] == '//': break\n            elif not in_block: newline.append(line[i])\n            i += 1\n        if newline and not in_block: ans.append(\"\".join(newline))\n    return ans\n```\n",
    "tags":
      "medium_programming_challenges string_processing deterministic_finite_automaton",
    "urgency": 7.03,
    "parent": "",
  },

  {
    "title": "Minimum in a Rotated but Sorted Array",
    "description":
      "> Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand, i.e.,  `[0,1,2,4,5,6,7]` might become  `[4,5,6,7,0,1,2]`. Find the minimum element. You may assume no duplicate exists in the array. What if there are duplicates?\n\n* Practice on [LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)\n\n[spoiler]\n```python\ndef minimum_in_rotated_sorted_array(self, nums):\n    lo, hi = 0, len(nums) - 1\n    if hi == 0: return nums[0]\n    if nums[hi] > nums[lo]: return nums[lo] # No rotation\n    while lo < hi:\n        mid = lo + (hi - lo) // 2\n        if nums[mid] > nums[mid+1]: return nums[mid+1] # e.g. [4,5,6,(7),0,1,2]\n        if nums[mid-1] > nums[mid]: return nums[mid] # e.g. [4,5,6,7,(0),1,2]\n        if nums[mid] > nums[0]: lo = mid + 1 # e.g. [4,5,(6),7,0,1,2]\n        else: hi = mid - 1 # e.g. [4,5,6,7,0,(1),2]\n\ndef minimum_in_rotated_sorted_array_with_duplicates(self, nums):\n    lo, hi = 0, len(nums) - 1\n    while lo != hi:\n        mid = lo + (hi - lo) // 2\n        if nums[mid] > nums[hi]: lo = mid + 1\n        # nums[mid] is the smallest on right side, it could be the smallest on the left side too\n        # so we need to include it in the following search.\n        elif nums[mid] < nums[hi]: hi = mid\n        # nums[mid] == nums[hi], we can't sure of the position of minimum in mid's left or right\n        else: hi -= 1\n    return nums[hi] # or nums[lo]\n\n```\n* Solution for possible duplicates adapted from [/u/sheehan's answer in the discussion forum](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/discuss/48808/My-pretty-simple-code-to-solve-it)\n",
    "tags":
      "array_search_under_constraints binary_search arrays medium_programming_challenges hard_programming_challenges",
    "urgency": 8.01,
    "parent": "",
  },

  {
    "title": "Rotate an NxN Matrix In-Place",
    "description":
      "> Given an \\(n \\times n\\) 2D matrix representing an image, rotate the image by clockwise by 90 degrees. Do this in-place.\n\n* Practice on [LeetCode](https://leetcode.com/problems/rotate-image/)\n\n[spoiler]\n* To rotate an \\(n \\times n\\) matrix clockwise by 90 degrees, swap the elements top to bottom, then find the transpose.\n* To rotate an \\(n \\times n\\) matrix anticlockwise by 90 degrees, swap the elements left to right, then find the transpose.\n```python\ndef rotate_matrix_clockwise_by_90_degrees(matrix):\n    N = len(matrix)\n    # Reverse up to down...\n    for r_idx in range(N // 2): # Remember to stop at half, lest you restore the original matrix\n        swap_r_idx = N - r_idx - 1\n        for c_idx in range(N):\n                matrix[r_idx][c_idx], matrix[swap_r_idx][c_idx] = matrix[swap_r_idx][c_idx], matrix[r_idx][c_idx]\n                \n        # Reverse the symmetry (i.e. transpose)\n        for r_idx in range(N):\n            for c_idx in range(r_idx):\n                matrix[r_idx][c_idx], matrix[c_idx][r_idx] = matrix[c_idx][r_idx], matrix[r_idx][c_idx]\n\n```\n* Solution obtained from [/u/shichaotan's submission](https://leetcode.com/problems/rotate-image/discuss/18872/A-common-method-to-rotate-the-image)\n",
    "tags":
      "medium_programming_challenges array_transformations arrays image_processing",
    "urgency": 6.35,
    "parent": "",
  },

  {
    "title": "Zigzag Level Order Traversal for Binary Tree",
    "description":
      "> Given a binary tree, return the zigzag level order traversal of its nodes' values. (i.e, from left to right, then right to left for the next level and alternate between).\n\n\n\n* Practice on [LeetCode](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)\n\n\n\n[spoiler]\n```python\ndef zigzag_level_order(self, root):\n    zigzag_order = []\n    def pre_order_traversal(node, level):\n        if node is None: return\n        if level >= len(zigzag_order): zigzag_order.append(deque([]))\n\n        if level % 2 == 0: zigzag_order[level].append(node.val)\n        else: zigzag_order[level].appendleft(node.val)\n\n        pre_order_traversal(node.left, level + 1)\n        pre_order_traversal(node.right, level + 1)\n\n    pre_order_traversal(root, 0)\n    for i in range(len(zigzag_order)): zigzag_order[i] = list(zigzag_order[i])\n    return zigzag_order\n\n```\n",
    "tags": "medium_programming_challenges binary_trees",
    "urgency": 7.65,
    "parent": "",
  },

  {
    "title": "Does an Increasing Triplet Subsequence Exist?",
    "description":
      "> Given an unsorted array return whether an increasing subsequence of length 3 exists or not in the array.\n\n* Practice on [LeetCode](https://leetcode.com/problems/increasing-triplet-subsequence/)\n\n[spoiler]\n\n* The algorithm doesn't necessarily give us a valid sequence, e.g. try `[5,1,5,5,0,0,0,0,8]`\n* It only keeps track of the lowest ending value of increasing subsequences of length 1 and 2 (credits to [/u/Ellest for pointing that out](https://leetcode.com/problems/increasing-triplet-subsequence/discuss/78995/Python-Easy-O(n)-Solution/83846))\n\n```python\ndef __increasing_triplet_exists(self, nums):\n    end_subseq_len_one, end_subseq_len_two = inf, inf\n    for n in nums:\n        if n <= end_subseq_len_one: end_subseq_len_one = n\n        elif n <= end_subseq_len_two: end_subseq_len_two = n\n        else: return True\n    return False\n```\n* Adapted from [/u/ginikuncoro's answer](https://leetcode.com/problems/increasing-triplet-subsequence/discuss/78995/Python-Easy-O(n)-Solution)\n",
    "tags":
      "medium_programming_challenges arrays array_search_under_constraints subsequence_algorithms",
    "urgency": 7.78,
    "parent": "",
  },

  {
    "title": "Maximum Length of a Pair Chain",
    "description":
      "> You are given \\(n\\) pairs of numbers, where in each pair \\((a,b)\\), \\(a < b\\). A pair \\((c, d)\\) can follow another pair \\((a, b)\\) if and only if b < c. Find the length longest chain which can be formed. You needn't use up all the given pairs. You can select pairs in any order.\n\n* Practice on [LeetCode](https://leetcode.com/problems/maximum-length-of-pair-chain/description/)\n\n[spoiler]\n* The DP solution is correct but slow \\(O(N^2)\\). The advantage to it is that we can rebuild a longest chain.\n* However, since this is a decision problem, we need not be able to reconstruct a longest chain.\n* Choosing the next addition to be the one with the lowest second coordinate is at least better than a choice with a larger second coordinate.\n```python\ndef __use_dp(self, pairs):\n    pairs.sort(key=itemgetter(0, 1))\n    N = len(pairs)\n    dp = [1 for _ in range(N)]\n       \n    for j in range(N):\n        starting_point = pairs[j][0]\n        for i in range(j):\n            if pairs[i][1] < starting_point: dp[j] = max(dp[j], dp[i] + 1)\n\n    return max(dp)\n\ndef __use_greedy_algorithm(self, pairs):\n    pairs.sort(key=itemgetter(1)) # Sort pairs by endpoints\n    greatest_endpoint, max_len = -inf, 0\n       \n    for start_point, end_point in pairs:\n        if greatest_endpoint < start_point:\n            greatest_endpoint = end_point\n            max_len += 1\n\n    return max_len\n```\n",
    "tags":
      "dynamic_programming decision_problems medium_programming_challenges greedy_algorithms sorting",
    "urgency": 7.51,
    "parent": "",
  },

  {
    "title": "Number of Longest Increasing Subsequences",
    "description":
      "> Given an unsorted array of integers, find the number of the longest increasing subsequences.\n\n\n* Practice on LeetCode: [Length of LIS](https://leetcode.com/problems/longest-increasing-subsequence/description/), [Number of LIS](https://leetcode.com/problems/number-of-longest-increasing-subsequence/description/)\n\n\n\n[spoiler]\n* Although calling `longest_common_subsequence(nums, sorted(set(nums)))` can get us the length of the LIS, it's too slow.\n\n\n```python\ndef __reference_dp(self, nums):\n    N = len(nums)\n    if N <= 1: return N\n    len_LIS_ending_at_idx, num_LIS_ending_at_idx = [1] * N, [1] * N\n\n    for j, num in enumerate(nums):\n        for i in range(j):\n            if nums[i] < nums[j]:\n                if len_LIS_ending_at_idx[i] + 1 > len_LIS_ending_at_idx[j]:\n                    len_LIS_ending_at_idx[j] = len_LIS_ending_at_idx[i] + 1\n                    num_LIS_ending_at_idx[j] = num_LIS_ending_at_idx[i]\n\n                elif len_LIS_ending_at_idx[i] + 1 == len_LIS_ending_at_idx[j]:\n                    num_LIS_ending_at_idx[j] += num_LIS_ending_at_idx[i]\n\n    len_max_LIS = max(len_LIS_ending_at_idx)\n    num_max_LIS = 0\n    for i, count in enumerate(num_LIS_ending_at_idx):\n        if len_LIS_ending_at_idx[i] == len_max_LIS: num_max_LIS += count\n\n    return num_max_LIS\n\n```\n",
    "tags":
      "medium_programming_challenges array_search_under_constraints arrays dynamic_programming subsequence_algorithms",
    "urgency": 6.96,
    "parent": "",
  },

  {
    "title": "Minmimum ASCII Delete Sum",
    "description":
      "> Given two strings `s1, s2`, find the lowest ASCII sum of deleted characters to make two strings equal.\n\n* Practice: [Minimum ASCII Delete Sum (LeetCode)](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/description/)\n\n[spoiler]\n* Notice that this is a special case of the edit distance problem. The only changes are how the grid is initialized and how the edit costs are calculated.\n\n```python\ndef minimum_ascii_delete_sum_for_two_strings(s1, s2):\n    s1 = \"\".join([\"#\", s1])\n    s2 = \"\".join([\"#\", s2])\n    len_s1, len_s2 = len(s1), len(s2)\n\n    # Initialize the grid with the cost of matching the empty string\n    edit_costs = [[0 for _1 in range(len_s2)] for _2 in range(len_s1)]\n    for s1_idx in range(1, len_s1):\n        edit_costs[s1_idx][0] = edit_costs[s1_idx-1][0] + ord(s1[s1_idx])\n    for s2_idx in range(1, len_s2):\n        edit_costs[0][s2_idx] = edit_costs[0][s2_idx-1] + ord(s2[s2_idx])\n\n    # Fill in the rest of the grid\n    for s1_idx in range(1, len_s1):\n        for s2_idx in range(1, len_s2):\n            edit_costs[s1_idx][s2_idx] = min(\n                edit_costs[s1_idx-1][s2_idx-1] + 0 if s1[s1_idx] == s2[s2_idx] else inf,\n                edit_costs[s1_idx-1][s2_idx] + ord(s1[s1_idx]),\n                edit_costs[s1_idx][s2_idx-1] + ord(s2[s2_idx])\n            )\n\n    return edit_costs[-1][-1]\n```\n",
    "tags":
      "medium_programming_challenges edit_distance string_processing dynamic_programming",
    "urgency": 7.63,
    "parent": "",
  },

  {
    "title": "Reverse a Linked List",
    "description":
      "> An iterative algorithm is cool and all, but can you do it recursively?\n\n\n[spoiler]\n* Here's the iterative solution...\n```python\ndef iterative_solution():\n    previous_node, current_node = None, head\n    if current_node is not None: next_node = current_node.next\n    else: return current_node # Empty list\n    while current_node is not None:\n        next_node = current_node.next\n        current_node.next = previous_node\n        previous_node = current_node\n        current_node = next_node\n    return previous_node\n\n```\n\n\n\n* Let's assume that nodes \\(n_{k+1}\\) to \\(n_m\\) had been reversed and we're now at node \\(n_k\\).\n* Now make \\(n_{k+1}\\)'s `next` to point to \\(n_k\\).\n* Remember to nullify \\(n_{k}\\)'s `next`. If \\(n_k\\) is not the head, \\(n_k.next\\) will be overwritten. If we forget to nullify it, our linked list will have a cycle.\n```java\npublic ListNode reverseList(ListNode head) {\n    if (head == null || head.next == null) return head;\n    ListNode p = reverseList(head.next);\n    head.next.next = head;\n    head.next = null;\n    return p;\n}\n```\n* [LeetCode Solution](https://leetcode.com/problems/reverse-linked-list/solution/)",
    "tags":
      "linked_lists easy_programming_challenges recursive_algorithms iterative_algorithms",
    "urgency": 7.17,
    "parent": "",
  },

  {
    "title": "Reverse Every Pair in a Linked List",
    "description":
      "> Given a linked list, swap every two adjacent nodes and return its head. For instance, \\(1 \\rightarrow 2 \\rightarrow 3 \\rightarrow 4\\), should return become \\(2 \\rightarrow 1 \\rightarrow 4 \\rightarrow 3\\)\n\n* Practice: [Swap Nodes in Pairs (LeetCode)](https://leetcode.com/problems/swap-nodes-in-pairs/description/)\n\n[spoiler]\n```java\npublic ListNode swapPairsRecursively(ListNode head) {\n    if (head == null || head.next == null) return head;\n    ListNode n = head.next;\n    head.next = swapPairsRecursively(head.next.next);\n    n.next = head;\n    return n;\n}\n\npublic ListNode swapPairsIteratively(ListNode head) {\n    if (head == null || head.next == null) return head;\n    ListNode newHead = head.next, a = head, b = a.next, pre = null;\n    while (a != null && b != null){\n      a.next = b.next;\n      b.next = a;\n      if (pre != null) pre.next = b;\n      if (a.next == null) break;\n      b = a.next.next;\n      pre = a;\n      a = a.next;\n    }\n    return newHead;\n}\n```\n* Recursive solution obtained from [/u/whoji](https://leetcode.com/problems/swap-nodes-in-pairs/discuss/11030/My-accepted-java-code.-used-recursion.)\n* Iterative solution obtained from [/u/YuTingLiu](https://leetcode.com/problems/swap-nodes-in-pairs/discuss/11028/My-straight-forward-Java-solution-without-recursion-or-dummy-nodes-(0ms))",
    "tags":
      "linked_lists medium_programming_challenges iterative_algorithms recursive_algorithms",
    "urgency": 8.59,
    "parent": "",
  },

  {
    "title": "Reverse Nodes in K-Group",
    "description":
      "> Given a linked list, reverse the nodes of a linked list \\(k\\) at a time and return its modified list. k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes in the end should remain as it is.\n\n* Practice: [Reverse Nodes in a K-Group (LeetCode)](https://leetcode.com/problems/reverse-nodes-in-k-group/description/), [Reverse Linked List in Groups of Given Size (Geeks for Geeks)](https://www.geeksforgeeks.org/reverse-a-list-in-groups-of-given-size/)\n\n[spoiler]\n\n```python\ndef reverseKGroup(head, k):\n    current, next_node, prev = head, None, None\n\n    # If we don't have k nodes left, leave them as they are\n    count, runner_node = 0, head\n    while runner_node and count < k:\n        count += 1\n        runner_node = runner_node.next\n    if count < k: return head\n\n    # Reverse first k nodes of the linked list\n    count = 0\n    while current is not None and count < k:\n        next_node = current.next\n        current.next = prev\n        prev = current\n        current = next_node\n        count += 1\n\n    # next is now points to the (k+1)th node\n    # recursively call for the list starting\n    # from current . And make rest of the list as\n    # next of first node\n    if next_node is not None:\n        head.next = self.reverseKGroup(next_node, k)\n\n    # prev is new head of the input list\n    return prev\n\n```\n* Solution adapted from [Geeks for Geeks article](https://www.geeksforgeeks.org/reverse-a-list-in-groups-of-given-size/)\n",
    "tags": "hard_programming_challenges linked_lists recursive_algorithms",
    "urgency": 8.4,
    "parent": "",
  },

  {
    "title": "You Need to Graduate!",
    "description":
      "> Given the total number of courses (labelled `0` to `n-1`) and a list of prerequisite pairs, return any ordering of courses you should take to finish all courses. Return an empty list if it's impossible to finish all the courses.\n\n* Practice on LeetCode: [Warmup Decision Problem](https://leetcode.com/problems/course-schedule/), [Actual Problem](https://leetcode.com/problems/course-schedule-ii/)\n\n\n[spoiler]\n* A topological sort is one such that all directed edges go from left to right. It's not possible if the graph has a cycle.\n* Each directed acyclic graph (DAG) has at least 1 topological sort.\n\n* Edges can represent precedence constraints, e.g. \\(x \\rightarrow y\\) means job \\(x\\) must be done before job \\(y\\)\n* Labeling the vertices in the reverse order that they are marked `processed` finds a topological sort of a DAG.\n\n\n\n```python\ndef __find_feasible_order(self, n, prerequisites):\n    UNDISCOVERED, DISCOVERED, COMPLETED = 0, 1, 2\n    G = [[] for _ in range(n)]\n    for course_id, prereq in prerequisites:\n        G[prereq].append(course_id)\n    state = [UNDISCOVERED for _ in range(n)]\n\n    topological_sort = deque([])\n    def find_topological_sort(course_id):\n        if state[course_id] == DISCOVERED: return False\n        if state[course_id] == COMPLETED: return True\n        state[course_id] = DISCOVERED\n        for enabled_course_id in G[course_id]:\n            if not find_topological_sort(enabled_course_id): return False\n        state[course_id] = COMPLETED\n        topological_sort.appendleft(course_id)\n        return True\n\n    for course_id in range(n):\n        if not find_topological_sort(course_id): return []\n    return list(topological_sort)\n```\n",
    "tags": "graph_algorithms medium_programming_challenges topological_sort",
    "urgency": 7.82,
    "parent": "",
  },

  {
    "title": "Restore IP Addresses",
    "description":
      "> Given a string containing only digits, restore it by returning all possible valid IP address combinations, e.g. `\"25525511135\"` should return `[\"255.255.11.135\", \"255.255.111.35\"]`\n\n\n* Practice on [LeetCode](https://leetcode.com/problems/restore-ip-addresses/)\n\n \n[spoiler]\n* Going for a recursion with memoization makes it tricky to ensure that you've covered the entire string.\n* Since IP address parts can at most be 3 chars, why not split the string into all possible permutations that satisfy the 3-char constraint?\n* Although the loops are nested, they have no dependence on the length of the substring!\n```python\ndef restore_ip_addresses(self, s):\n    len_s = len(s)\n    if len_s < 4 or len_s > 12: return []\n\n    def fetch_ip_address(idx_1, idx_2, idx_3):\n        ip_address = [s[:idx_1], s[idx_1:idx_2], s[idx_2:idx_3], s[idx_3:]]\n        for substr in ip_address:\n            if len(substr) != 1 and (substr[0] == \"0\" or int(substr) > 255):\n                    return None\n            return \".\".join(ip_address)\n\n    ip_addresses = []\n    for a in range(1, 4):\n        for b in range(1, 4):\n            for c in range(1, 4):\n                for d in range(1, 4):\n                    if a + b + c + d == len_s:\n                        valid_ip_address = fetch_ip_address(a, a+b, a+b+c)\n                        if valid_ip_address: ip_addresses.append(valid_ip_address)\n    return ip_addresses\n\n```\n* Adapted from [/u/mitbbs8080's solution on LeetCode](https://leetcode.com/problems/restore-ip-addresses/discuss/30972/WHO-CAN-BEAT-THIS-CODE)\n",
    "tags": "medium_programming_challenges string_processing",
    "urgency": 7.32,
    "parent": "",
  },

  {
    "title": "Neighborhood Search in a Sorted Array",
    "description":
      "> Find the \\(k\\) elements closest to \\(target\\) in a sorted array\n\n\n\n* Try it first on [LeetCode](https://leetcode.com/problems/find-k-closest-elements/description/)\n\n\n\n[spoiler]\nThe array is sorted, so modify binary search to get the element closest to `target`.\n```python\ndef get_k_closest_elements(self, arr, k, target):\n    # Set `mid` such that arr[0:mid] <= target\n    lo, hi, mid = 0, len(arr) - 1, None\n    while lo <= hi:\n        mid = int(lo + (hi - lo) / 2)\n        if arr[mid] > target: hi = mid - 1\n        else: lo = mid + 1\n    if mid > 0 and abs(arr[mid-1] - target) < abs(arr[mid] - target): mid -= 1\n\n    left_idx, right_idx = mid, mid+1\n    while right_idx - left_idx - 1 < k:\n        choose_left, choose_right = False, False\n        if left_idx >= 0 and right_idx < len(arr):\n            # Since we break ties by choosing the smaller element...\n            if abs(target - arr[left_idx]) <= abs(arr[right_idx] - target): choose_left = True\n            else: choose_right = True\n        elif left_idx >= 0: choose_left = True\n        elif right_idx < len(arr): choose_right = True\n\n        if choose_left: left_idx -= 1\n        elif choose_right: right_idx += 1\n        else: break\n    return arr[left_idx+1: right_idx]\n```\n\n* After you've found your first item, a linear search to the left and the right should help you find the \\(K\\) elements.\n* Note that you only need to expand the left and right pointers without creating a new array.\n* Simplify the condition: \\((right\\_idx - 1) - (left\\_idx + 1) + 1 = right\\_idx - left\\_idx - 1\\)\n",
    "tags":
      "arrays binary_search medium_programming_challenges iterative_algorithms array_contiguous_elements",
    "urgency": 7.14,
    "parent": "",
  },

  {
    "title": "Longest Sequence of Alternating Min and Max Peaks in an Array",
    "description":
      "> Given an array \\(nums\\), what's the longest wiggle subsequence? Use \\(O(1)\\) space and \\(O(n)\\) time.\n\n* Try it on [LeetCode](https://leetcode.com/problems/wiggle-subsequence/description/)\n\n[spoiler]\n\n```python\nN = len(nums)\nif N < 2: return N\nlen_longest_up_wiggle, len_longest_down_wiggle = 1, 1\nfor i in range(1, N):\n    if nums[i] > nums[i-1]: len_longest_up_wiggle = len_longest_down_wiggle + 1\n    elif nums[i] < nums[i-1]: len_longest_down_wiggle = len_longest_up_wiggle + 1\nreturn max(len_longest_up_wiggle, len_longest_down_wiggle)\n```\n",
    "tags":
      "dynamic_programming arrays medium_programming_challenges array_search_under_constraints subsequence_algorithms",
    "urgency": 6.82,
    "parent": "",
  },
];

/**
 * @returns {Array} contains at most `numCards` chosen at random without replacement.
 */
export function getRandomSampleCards(numCards: number): SampleCard[] {
  const cardIndexes = new Array(Math.min(numCards, sampleCards.length));
  for (let i = 0; i < cardIndexes.length; i++) { cardIndexes[i] = i; }
  let randomIdx, temp;
  for (let i = 0; i < cardIndexes.length; i++) {
    randomIdx = Math.floor(Math.random() * (cardIndexes.length - i)) + i;
    temp = cardIndexes[randomIdx];
    cardIndexes[randomIdx] = cardIndexes[i];
    cardIndexes[i] = temp;
  }

  const cards = new Array(cardIndexes.length);
  for (let i = 0; i < cardIndexes.length; i++) {
    cards[i] = sampleCards[cardIndexes[i]];
  }
  return cards;
}

export function getRandomCards(
  numCards: number,
  userID: number,
): CreateCardParams[] {
  return getRandomSampleCards(numCards).map((sampleCard) => {
    sampleCard.createdById = userID;
    sampleCard.isPublic = Math.random() > 0.4;
    return sampleCard as CreateCardParams;
  });
}
