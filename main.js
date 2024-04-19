const canvas = document.querySelector('body>canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min
}

class Star {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 14
        this.gravity = 0.8
    }
    explode() {
        for (let i = 0; i < 8; i++) {
            particles.push(new Particle({
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                velocity: {
                    x: randomNumber(-5, 5),
                    y: randomNumber(-10, 5)
                }
            }))
        }
        this.radius -= 4
    }
    draw() {
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = 'white'
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.shadowColor = 'white'
        ctx.shadowBlur = 20
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}



class Particle {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 3
        this.gravity = 0.15
        this.lifeTime = 150
        this.opacity = 1
    }
    draw() {
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.shadowColor = 'white'
        ctx.shadowBlur = 20
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    explode() { }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.lifeTime--
        this.opacity -= 1 / this.lifeTime
    }
}

const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, '#171E26')
backgroundGradient.addColorStop(1, '#3f586b')
const groundHeight = 100

const stars = []
const particles = []
const backgroundStars = []

for(let i = 0; i<200; i++){
    const x = randomNumber(0, canvas.width)
    const y = randomNumber(0, canvas.height)
    backgroundStars.push(new Star({
        position: {
            x: x,
            y: y
        }
    }))
    backgroundStars[i].radius = randomNumber(0, 4)
}

let timer = 0
let spawnRate = 75

const generateStars = () => {
    if(timer%spawnRate===0){
        stars.push(new Star({
            position: {
                x: randomNumber(30, canvas.width - 30),
                y: -100
            },
            velocity: {
                x: randomNumber(-8,8),
                y: 2
            }
        }))
        spawnRate = randomNumber(75, 200)
    }
}


const createMountains = (amount, height, color) => {
    for(let i = 0; i<amount; i++){
        const mountainWidth = canvas.width/amount
        ctx.beginPath()
        ctx.moveTo(i * mountainWidth - 400, canvas.height-groundHeight)
        ctx.lineTo(i * mountainWidth + mountainWidth +400, canvas.height-groundHeight)
        ctx.lineTo(i * mountainWidth + mountainWidth/2, (canvas.height-groundHeight) - height)
        ctx.lineTo(i * mountainWidth - 400, canvas.height-groundHeight)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()
    }
}

const bouncing = ({ object }) => {
    if (object.position.y + object.radius + object.velocity.y > canvas.height - groundHeight) {
        object.velocity.y *= -1
        object.velocity.y *= 0.7
        object.explode()
    }
    else if(object.position.x + object.radius + object.velocity.x>= canvas.width || 
            object.position.x - object.radius + object.velocity.x<= 0){
        object.velocity.x *= -1
        object.velocity.x *= 0.7
        object.explode()
    }
    else {
        object.velocity.y += object.gravity
    }
}


const animate = () => {
    window.requestAnimationFrame(animate)
    canvas.width = innerWidth
    canvas.height = innerHeight
    ctx.fillStyle = backgroundGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    backgroundStars.forEach((backgroundStar)=>{
        backgroundStar.draw()
    })
    createMountains(1, canvas.height-200, '#384551')
    createMountains(2, canvas.height-300, '#2b3843')
    createMountains(3, canvas.height-400, '#26333e')
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = '#182028'
    ctx.fillRect(0, canvas.height-100, canvas.width, 100)
    ctx.closePath()
    ctx.restore()

    generateStars()
    stars.forEach((star, i) => {
        star.draw()
        star.update()
        bouncing({ object: star })
        if (star.radius <= 2) {
            stars.splice(i, 1)
        }
    })
    particles.forEach((particle, i) => {
        particle.draw()
        particle.update()
        bouncing({ object: particle })
        if (particle.lifeTime <= 0) {
            particles.splice(i, 1)
        }
    })
    timer++
}
animate()
