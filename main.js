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
        this.radius = 20
        this.gravity = 0.8
    }
    loseEnergy() {
        this.velocity.y *= 0.7
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
        this.radius -= 5
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = 'white'
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
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
        this.gravity = 0.2
        this.lifeTime = 150
        this.opacity = 1
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    explode() { }
    loseEnergy() {
        this.velocity.y *= 0.7
    }
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

const stars = []
const particles = []

stars.push(new Star({
    position: {
        x: canvas.width / 2,
        y: 25
    },
    velocity: {
        x: 0,
        y: 2
    }
}))

const createMountains = (amount, height, color) => {
    for(let i = 0; i<amount; i++){
        const mountainWidth = canvas.width/amount
        ctx.beginPath()
        ctx.moveTo(i * mountainWidth - 400, canvas.height)
        ctx.lineTo(i * mountainWidth + mountainWidth +400, canvas.height)
        ctx.lineTo(i * mountainWidth + mountainWidth/2, canvas.height- height)
        ctx.lineTo(i * mountainWidth - 400, canvas.height)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()
    }
}

const bouncing = ({ object }) => {
    if (object.position.y + object.radius + object.velocity.y > canvas.height) {
        object.velocity.y *= -1
        object.loseEnergy()
        object.explode()
    }
    else {
        object.velocity.y += object.gravity
    }
}


const animate = () => {
    window.requestAnimationFrame(animate)
    ctx.fillStyle = backgroundGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    createMountains(1, canvas.height-100, '#384551')
    createMountains(2, canvas.height-200, '#2b3843')
    createMountains(3, canvas.height-300, '#26333e')

    stars.forEach((star, i) => {
        star.draw()
        star.update()
        bouncing({ object: star })
        if (star.radius <= 0) {
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

}
animate()
