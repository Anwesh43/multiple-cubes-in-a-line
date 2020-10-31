import * as THREE from 'three.js'

class Dimensions {

    init() {
        this.w = window.innerWidth 
        this.h = window.innerHeight 
    }

    handleResize() {
        window.onresize = () => {
            this.w = window.innerWidth 
            this.h = window.innerHeight
        }
    }
}

const dimensions = new Dimensions()
dimensions.init()
dimensions.handleResize()

class Stage {


    init() {
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(dimensions.w, dimensions.h)
        this.camera = new THREE.PerspectiveCamera(45, dimensions.w / dimensions.h, 0.1, 1000)
        this.camera.position.z = 5
        this.scene = new THREE.Scene()
        this.cbs = []
        document.body.appendChild(this.renderer.domElement)    
    }

    addMesh(mesh) {
        this.scene.add(mesh)
    }

    update(cb) {
        this.cbs.push(cb)
    }

    render() {
        this.renderer.render(this.scene, this.camera)
        this.cbs.forEach((cb) => {
            cb()
        })
    }
}

class Animator {

    start(cb) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, 100)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

const colors = [0x673AB7, 0x4CAF50, 0xF44336]
let i = 0
class CubeFactory {

    static create(stage) {
        
        
        const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        const material = new THREE.MeshBasicMaterial({color : colors[i % 3]})
        const cube = new THREE.Mesh(geo, material)
        cube.position.z = -(i * 3) 
        stage.update(() => {
            cube.rotation.x += (Math.PI / 10)
        })
        stage.addMesh(cube)
        i++
        return cube 
    }
}

const stage = new Stage()
stage.init()
CubeFactory.create(stage)
stage.render()

const animator = new Animator() 

let t = 0
stage.update(() => {
    stage.camera.position.z -= 0.1
    t++
    if (t % 20 == 0) {
      CubeFactory.create(stage)
    }
    if (t % 100 == 0) {
        animator.stop()
        stage.render()
    }
})


document.body.onclick = () => {

    animator.start(() => {
        stage.render()
    })
}