let outer = null

function run() {
  let inner = outer
  function unused() {
    if (inner) console.log('hi')
  }
  outer = {
    logStr: new Array(1000000).join('*')
  }
}

setInterval(run, 1000)
