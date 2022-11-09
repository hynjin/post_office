import { GetServerSideProps } from 'next';
import React, {
    useState,
    useCallback,
    useRef,
    useEffect,
    useMemo,
} from 'react';
import styles from '../styles/Home.module.css';
import { useForm } from 'react-hook-form';
import { fetcher, postFetcher } from '../helper/Helper';
import useSWR from 'swr';
import _ from 'lodash';

export default function SnowFlake() {
    const snowRef = useRef<HTMLCanvasElement>(null);

    const canvasHeight = 1200;
    const canvasWidth = 800;
    
    const snowVersion1 = useCallback(() => {
        const canvas = snowRef?.current;
        const canvasContext = canvas?.getContext('2d');


        var flakes = [];
        const flakeCount = 200;
        let mX = -100;
        let mY = -100;
    
    
    function snow() {
        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    
        for (var i = 0; i < flakeCount; i++) {
            var flake = flakes[i],
                x = mX,
                y = mY,
                minDist = 150,
                x2 = flake.x,
                y2 = flake.y;
    
            var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
                dx = x2 - x,
                dy = y2 - y;
    
            if (dist < minDist) {
                var force = minDist / (dist * dist),
                    xcomp = (x - x2) / dist,
                    ycomp = (y - y2) / dist,
                    deltaV = force / 2;
    
                flake.velX -= deltaV * xcomp;
                flake.velY -= deltaV * ycomp;
    
            } else {
                flake.velX *= .98;
                if (flake.velY <= flake.speed) {
                    flake.velY = flake.speed
                }
                flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
            }
    
            canvasContext.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
            flake.y += flake.velY;
            flake.x += flake.velX;
                
            if (flake.y >= canvasHeight || flake.y <= 0) {
                reset(flake);
            }
    
    
            if (flake.x >= canvasWidth || flake.x <= 0) {
                reset(flake);
            }
    
            canvasContext.beginPath();
            canvasContext.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            canvasContext.fill();
        }
        requestAnimationFrame(snow);
    };
    
    function reset(flake) {
        flake.x = Math.floor(Math.random() * canvasWidth);
        flake.y = 0;
        flake.size = (Math.random() * 3) + 2;
        flake.speed = (Math.random() * 1) + 0.5;
        flake.velY = flake.speed;
        flake.velX = 0;
        flake.opacity = (Math.random() * 0.9) + 0.1;
    }
    
    function init() {
        for (var i = 0; i < flakeCount; i++) {
            var x = Math.floor(Math.random() * canvasWidth),
                y = Math.floor(Math.random() * canvasHeight),
                size = (Math.random() * 3) + 2,
                speed = (Math.random() * 1) + 0.5,
                opacity = (Math.random() * 0.5) + 0.3;
    
            flakes.push({
                speed: speed,
                velY: speed,
                velX: 0,
                x: x,
                y: y,
                size: size,
                stepSize: (Math.random()) / 30,
                step: 0,
                angle: 180,
                opacity: opacity
            });
        }
        snow();
    };
    
    
    init();

    }, []);

    const snowVersion2 = useCallback(() => {
        const canvas = snowRef?.current;
        const canvasContext = canvas?.getContext('2d');
        // Variables
        const snowAttributes = {
            particleCount: 400,   // Change amount of snowflakes
            particleSize: 3,      // Max size of a snowflake
            fallingSpeed: 1,      // Intensity of the snowfall horizontal
            colors: ['#ccc', '#eee', '#fff', '#ddd'] // Array of usable colors
        }
        
        // Utility Functions
        function randomIntFromRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        
        function randomColor(colors) {
            return colors[Math.floor(Math.random() * colors.length)]
        }
        
        function distance(x1, y1, x2, y2) {
            const xDist = x2 - x1
            const yDist = y2 - y1
        
            return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
        }
        
        // Objects
        function Particle(x, y, radius, color, radians) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.radians = radians;
            this.velocity = 0.001;
        
            this.update = () => {
                // Move these points over time
                this.radians += this.velocity;
                this.x = x + Math.cos(this.radians) * 200 ;
                this.y = y + Math.tan(this.radians) * 200 ;
        
                this.draw();
            }
        
            this.draw = () => {
                canvasContext.beginPath()
                canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
                canvasContext.fillStyle = this.color
                canvasContext.fill()
        
                canvasContext.closePath()
            }
        }
        
        // Implementation
        let particles;
        function init() {
            particles = [];
        
            for (let i = 0; i < snowAttributes.particleCount; i++) {
                particles.push(
                    new Particle(
                        Math.random() * canvasWidth,
                        Math.random() * canvasHeight,
                        randomIntFromRange(0.5, snowAttributes.particleSize),
                        randomColor(snowAttributes.colors),
                        Math.random() * 80
                    )
                );
            }
        }
        
        // Animation Loop
        function animate() {
            requestAnimationFrame(animate)
            canvasContext?.clearRect(0, 0, canvasWidth, canvasHeight);
        
            particles.forEach(particle => {
                particle.update();
            });
        }
        
        init();
        animate();

    }, []);


    useEffect(() => {
        const version = Math.floor((Math.random() * 100) + 1) % 2;

        version === 0 ? snowVersion1() : snowVersion2();
    }, [snowVersion1, snowVersion2]);

    return (
        <canvas 
            style={{
                // position: 'absolute',
                zIndex: 99999,
            }}
            id={'snow'} ref={snowRef} height={canvasHeight} width={canvasWidth} />
    );
}