const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = 300
let score = 0
const background_img = new Image()
background_img.src = 'background.jpg'
const sound = document.createElement('audio')
sound.src = 'bg.mp3'
// raven
const ravenImg = new Image()
ravenImg.src = 'raven.png'
let raven_width = 271
let raven_height = 194
let ravenX = 400
let ravenY = 50
let raven_frameX = 0
// AI
const aiImg = new Image()
aiImg.src = 'ai-dog.png'
let ai_width = 110.88
let ai_height = 100.83
let ai_x = canvas.width-30
let ai_y = 200
let ai_size = 60
let ai_frameX = 0
let ai_frameY = 7


let gameClose = false
let player_width = 200
let player_height = 181.83333333333
let gameFrame = 0
let fps = 4

let position = {
  touchStart: {},
  touchEnd: {}
}

let playerAnimations = []
let playerAnimationStates = [{
  name: 'idle-right',
  frames: 7
},
  {
    name: 'idle-left',
    frames: 7
  },
  {
    name: 'jump-right-up',
    frames: 7
  },
  {
    name: 'jump-left-up',
    frames: 7
  },
  {
    name: 'jump-right-fall',
    frames: 7
  },
  {
    name: 'jump-left-fall',
    frames: 7
  },
  {
    name: 'run-right',
    frames: 9
  },
  {
    name: 'run-left',
    frames: 9
  }]

playerAnimationStates.forEach((state, index)=> {
  let frames = {
    loc: []
  }
  for (let i = 0; i < state.frames; ++i) {
    frames.loc.push({
      x: i*player_width, y: index*player_height
    })
  }
  playerAnimations[state.name] = frames
})



// player class

class Player {
  constructor (x,
    y,
    src,
    state) {
    this.x = x
    this.y = y
    this.speed = 1
    this.image = new Image()
    this.image.src = src
    this.size = 60
    this.radius = 25
    this.offsetX = 30
    this.offsetY = 35
    this.state = state
  }

  draw() {
    ctx.fillStyle = 'rgba(0,0,0,0)'
    ctx.fillRect (this.x-20,
      this.y-20,
      35,
      35)
    let position = Math.floor(gameFrame/fps)%playerAnimations[this.state].loc.length
    let frameX = player_width*position
    let frameY = playerAnimations[this.state].loc[position].y

    ctx.drawImage(this.image,
      frameX,
      frameY,
      player_width,
      player_height,
      this.x-this.offsetX,
      this.y-this.offsetY,
      this.size,
      this.size)
    this.update()
  }


  update () {
    let dx = Math.floor(position.touchStart.x - position.touchEnd.x)
    let dy = Math.floor(position.touchStart.y- position.touchEnd.y)
    if ((dy >= 30 || dy <= 30) && position.touchStart.y > position.touchEnd.y) {
      this.speed = 1
      this.state = 'run-right'
    }

    if ((dy >= 30 || dy <= 30) && position.touchStart.y < position.touchEnd.y) {
      this.speed = -1
      this.state = 'run-left'
    }

    if (this.x > canvas.width-this.offsetX) {
      this.speed = -1
      this.state = 'run-left'
      position = {
        touchStart: {},
        touchEnd: {}
      }

    }

    if (this.x < this.offsetX) {
      this.speed = 1
      this.state = 'run-right'
      position = {
        touchStart: {},
        touchEnd: {}
      }
    }
    this.x += this.speed
  }
}

function drawAi() {
  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect (ai_x, ai_y, 30, 30)
  ctx.drawImage (aiImg, ai_frameX*ai_width, ai_frameY*ai_height, ai_width, ai_height, ai_x-15, ai_y-20, ai_size, ai_size)
  updateAi()
}

let ai_speed = -1

function updateAi() {
  if (Math.floor(Math.sqrt(Math.pow(ai_x-eggX, 2)+Math.pow(ai_y-eggY, 2))) < 20) {
    egg_offset = 1000
    score++
    egg_lay_position = Math.floor(Math.random()*(canvas.width-50))
  }
  if (ai_x < 7) {
    ai_speed = 1
    ai_frameY = 6
  }
  if (ai_x > canvas.width-35) {
    ai_speed = -1
    ai_frameY = 7
  }
  ai_x += ai_speed
}

const player = new Player (20, 210, 'dog.png', 'run-right')

let eggImg = new Image()
eggImg.src = 'egg.png'
let eggX
let eggY
let eggSize = 20
let falling_speed = 0
let gravity = 0
let egg_lay_position = Math.floor(Math.random()*canvas.width)
let egg_offset = 1000


function isColide () {
  let distance = Math.floor (Math.sqrt(Math.pow(player.x-eggX, 2)+Math.pow(player.y-eggY, 2)))
  if (distance <= 25) {
    return true
  } else return false
}

function fallEgg() {
  let Colide = isColide()
  if (Colide) {
    egg_offset = 1000
  }

  if (Colide) {
    egg_lay_position = Math.floor(Math.random()*(canvas.width-50))
    falling_speed = 0.02
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0)'
    ctx.fillRect(eggX, eggY, 20, 20)
    ctx.drawImage (eggImg, eggX+egg_offset+9, eggY+egg_offset+8, eggSize, eggSize)
  }

  if (eggY > canvas.height-100) {
    falling_speed = 0
    gravity = 0
  }
  eggY += falling_speed + gravity
  gravity += 0.1
}
function animate() {
  if (!gameClose && score < 100) {
    requestAnimationFrame (animate)
  } else alert ("GAME OVER\n(The pink dog seems to have collected more than 2 eggs)\nSWIPE DOWN TO RESTART")
  ctx.drawImage (background_img,
    0,
    0,
    canvas.width,
    canvas.height)
  ctx.drawImage (ravenImg, raven_width*raven_frameX, 0, raven_width, raven_height, ravenX, ravenY, 30, 30)
  if (!(gameFrame%fps)) {
    if (raven_frameX < 5) raven_frameX++
    else raven_frameX = 0

    if (ai_frameX < 8) ai_frameX++
    else ai_frameX = 0
  }

  if (ravenX === egg_lay_position) {
    eggX = ravenX
    eggY = ravenY
    egg_offset = 0
  }

  if (ravenX < 0-50) {
    ravenX = 460
    ravenY = Math.floor(Math.random()*50)+10
  }
  fallEgg()
  drawAi()
  player.draw()
  gameFrame++
  ravenX -= 1

}
animate()

canvas.addEventListener ('touchstart', e=> {
  if (!gameClose)
    e.preventDefault()

  position.touchStart.x = e['changedTouches']['0'].screenX
  position.touchStart.y = e['changedTouches']['0'].screenY
})

canvas.addEventListener ('touchend', e=> {
  if (!gameClose)
    e.preventDefault()

  position.touchEnd.x = e['changedTouches']['0'].screenX
  position.touchEnd.y = e['changedTouches']['0'].screenY
})

//sound.play()
