function deliveryRouteOptimization(buildings, start) {
  // create a distance matrix
  const n = buildings.length;
  const dist = Array.from({ length: n }, () => new Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      dist[i][j] = getDistance(buildings[i], buildings[j]);
    }
  }
  // initialize the memoization table so that it can be used to store the distances between all possible pairs of buildings
  const memo = Array.from({ length: n }, () => new Array(1 << n));
  for (let i = 0; i < n; i++) {
    memo[i][1 << i] = i === start ? 0 : Infinity;
  }
  
  // compute the optimal tour using dynamic programming
  // using the formula
  // g(i,s) = min [ w(i,j) + g(j,{s-j}) ]
  // where, i= starting cities
  //        s= the set of remaining cities
  //        w(i,j)= distance bewteen i and j
  //        g(x,∅)= w(x,i), where ∅ is empty set
  
  for (let s = 1; s < (1 << n); s++) {
    for (let i = 0; i < n; i++) {
      if (!(s & (1 << i))) continue;
      for (let j = 0; j < n; j++) {
        if (i === j || !(s & (1 << j))) continue;
        memo[i][s] = Math.min(memo[i][s] || Infinity, dist[i][j] + memo[j][s & ~(1 << i)]);
      }
    }
  }
  // construct the optimal tour from the memoization table
  const tour = [start];
  let s = (1 << n) - 1;
  let i = start;
  while (s > 1) {
    let j = -1;
    for (let k = 0; k < n; k++) {
      if (k === i || !(s & (1 << k))) continue;
      if (j === -1 || memo[i][s] === dist[i][k] + memo[k][s & ~(1 << i)]) {
        j = k;
      }
    }
    if(j!=-1){
        tour.push(j);
    }
    
    s &= ~(1 << i);
    i = j;
  }
  tour.push(start);
  console.log(tour)
  return tour.map(i => buildings[i]);
}

function getDistance(building1, building2) {
  // compute the Euclidean distance between two buildings
  const dx = building1.x - building2.x;
  const dy = building1.y - building2.y;
  return Math.sqrt(dx * dx + dy * dy);
}



// building is the list of building to be visited with thier names and x and y coordination to calculate thier distance between each of the building
let building = [
  { name:"a", x:2, y:3},
  { name:"b", x:3, y:3},
  { name:"c", x:1, y:4},
  { name:"d", x:3, y:2},
  { name:"e", x:1, y:5},
]
//starting is the starting index of the list of building
let starting= 0

// the function to Implement a route planning algorithm for a delivery company
let output = deliveryRouteOptimization(building, starting)
console.log(output)