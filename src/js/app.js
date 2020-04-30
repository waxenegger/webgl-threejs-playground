import * as THREE from 'three/build/three.module';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

import 'css/app.css';

class App {
    container = null;
	camera = null;
    scene = null;
    renderer = null;
    mouseX = 0;
    mouseY = 0;
    windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
    object = null;

    init() {
        this.container = document.getElementById( 'index' );

        this.camera =
            new THREE.PerspectiveCamera(
                45, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.z = 10;

        // scene
        this.scene = new THREE.Scene();
        this.scene.add( new THREE.AmbientLight( 0xcccccc, 0.4 ) );
        this.camera.add( new THREE.PointLight( 0xffffff, 0.8 ) );
        this.scene.add( this.camera );

        // manager
        const manager = new THREE.LoadingManager(() => {
            this.object.position.y = 0;
            this.scene.add( this.object );
        } );
        manager.onProgress = ( item, loaded, total ) => {
            console.log( item, loaded, total );
        };

        // model
        const onProgress = (xhr) => {
            if ( xhr.lengthComputable ) {
                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log( `model ${Math.round( percentComplete, 2 )} % downloaded` );
            }
        }

        const loader = new OBJLoader( manager );
        loader.load( './models/nanosuit.obj',
                        ( obj ) => this.object = obj,
                        onProgress,
                        (err) => console.error(err)
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.domElement.style='max-width: 100%;max-height: 100%;';
        this.container.appendChild( this.renderer.domElement );

        document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    }

    onWindowResize() {
		this.windowHalfX = window.innerWidth / 2;
    	this.windowHalfY = window.innerHeight / 2;

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();

    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    onMouseMove(event) {
		this.mouseX = ( event.clientX - this.windowHalfX ) / 2;
		this.mouseY = ( event.clientY - this.windowHalfY ) / 2;
    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );
		this.render();
    }

    render() {
        this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;
        this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * .05;

        this.camera.lookAt( this.scene.position );

        this.renderer.render( this.scene, this.camera );
    }
}

const app = new App();
app.init();
app.animate();
