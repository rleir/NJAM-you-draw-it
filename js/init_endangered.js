var pymChild = null;
var pymChild = new pym.Child();

var data = [
    {'year': 2001, 'house': 115},
    {'year': 2002, 'house': 125},
    {'year': 2003, 'house': 153},
    {'year': 2004, 'house': 169},
    {'year': 2005, 'house': 184},
    {'year': 2006, 'house': 205},
    {'year': 2007, 'house': 222},
    {'year': 2008, 'house': 234},
    {'year': 2009, 'house': 244},
    {'year': 2010, 'house': 262},
    {'year': 2011, 'house': 278},
    {'year': 2012, 'house': 287},
    {'year': 2013, 'house': 298},
    {'year': 2014, 'house': 306},
    {'year': 2015, 'house': 316},
    {'year': 2016, 'house': 320},
    {'year': 2017, 'house': 321},
    {'year': 2018, 'house': 338},
    {'year': 2019, 'house': 356}
]

var winwidth = parseInt(d3.select('#chart-body-3').style('width'))
var winheight = parseInt(d3.select('#chart-body-3').style('height'))


var ƒ = d3.f

var sel = d3.select('#chart-body-3').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: winwidth, 
  height: 250, 
  margin: {left: 50, right: 50, top: 5, bottom: 30}
})

pymChild.sendHeight();



c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.svg.append('circle').attr('cx',c.totalWidth*.21-13).attr('cy',c.height*.53).attr('r', 5).attr('class', 'intro-dot')

c.svg.append('text').attr('x',c.totalWidth*.21-5).attr('y',c.height*.52).text('Start dragging here').attr('class','intro-text')


c.x.domain([2001, 2019])
c.y.domain([0, 400])

c.xAxis.ticks(4).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(d => d )

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('house', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('house', c.y))

var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  .at({width: c.x(2005) - 2, height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')

correctSel.append('path.area.house-area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path#your-line-3').attr('class', 'your-line house-line')

c.drawAxis()

yourData = data
  .map(function(d){  return {year: d.year, house: d.house, defined: 0} })
  .filter(function(d){
    if (d.year == 2005) d.defined = true
    return d.year >= 2005
  })

var completed = false

var drag = d3.drag()
  .on('drag', function(){
    d3.selectAll('.intro-text').style('opacity', 0)
    var pos = d3.mouse(this)
    var year = clamp(2005, 2019, c.x.invert(pos[0]))
    var house = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.house = house
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2019))
        d3.select('#answer-3')
            .style('visibility', 'visible')
            .html("<div>You guessed <p class='your-pink'>"+ d3.format(",.3r")(yourData[yourData.length-1].house) + "</p> for 2019.</div><div>The real value was <p class='your-pink'>"+d3.format(",.3r")(data[18].house)+"</p>.</div>")
      d3.select('#explain-3').style('visibility', 'visible').style('opacity', 1)
          pymChild.sendHeight();


    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }
