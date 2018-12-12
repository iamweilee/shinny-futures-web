const UpDownEqualFunc = function () {
  return {
    up : (d) => d.open < d.close,
    down : (d) => d.open > d.close,
    equal : (d) => d.open === d.close
  }
}

const UpDownEqual = UpDownEqualFunc()

class Candle {
  constructor (opts){
    this.name = opts.name ? opts.name : (new Date().getTime())
    this.plot = opts.plot ? opts.plot : null
    this.types = ['line', 'body']
  }
  createPaths () {
    this.paths = []
    Object.keys(UpDownEqual).forEach(k => this.paths.push([this.name, 'line', k].join('.')))
    Object.keys(UpDownEqual).forEach(k => this.paths.push([this.name, 'body', k].join('.')))
    return this.paths
  }
  calcPaths (left_id, right_id, data) {
    if (!this.plot.yScale || !this.plot.xScale || !this.plot.barWidth || !this.plot.barPadding) return
    let _path = {}
    this.paths.forEach(k => _path[k] = '')
    for (let i = left_id; i<= right_id && data[i]; i++) {
      Object.keys(UpDownEqual).forEach(key => {
        if (UpDownEqual[key](data[i])) {
          _path[[this.name, 'body', key].join('.')] += this.bodyPath(data[i], i)
          _path[[this.name, 'line', key].join('.')] += this.linePath(data[i], i)
        }
      })
    }
    return _path
  }
  bodyPath (d, id){
    let o = this.plot.yScale(d.open)
    let c = this.plot.yScale(d.close)
    let x = this.plot.xScale(id) + this.plot.barPadding
    let width = this.plot.barWidth - this.plot.barPadding * 2
    let path = `M ${x} ${o} l ${width} ${0}`
    if(o !== c) {
      path += ` L ${x + width} ${c} l ${-width} ${0} L ${x} ${o}`;
    }
    return path
  }
  linePath (d, id){
    let h = this.plot.yScale(d.high)
    let l = this.plot.yScale(d.low)
    let x = this.plot.xScale(id) + this.plot.barWidth / 2
    let path = `M ${x} ${h} L ${x} ${l}`
    return path
  }
}

export default Candle
