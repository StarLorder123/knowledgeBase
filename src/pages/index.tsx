import React, { useEffect, useRef, useState } from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ripples, setRipples] = useState<Array<{x: number; y: number; id: number}>>([]);
  const rippleId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const numberOfParticles = 50;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setRipples(prev => [...prev, {x, y, id: rippleId.current++}]);
      
      // 移除旧的水波纹
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== rippleId.current - 1));
      }, 3000);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className={styles.ripple}
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
      <div className="container">
        <h1 className={clsx('hero__title', styles.heroTitle)}>
          <span className={styles.titleHighlight}>{siteConfig.title}</span>
        </h1>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--secondary button--lg', styles.exploreButton)}
            to="/docs/ocean-engine">
            开始探索
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <div className={clsx(styles.featureCard, styles.cardHover)}>
              <div className={styles.cardIcon}>🌊</div>
              <h3>洋流引擎</h3>
              <p>探索计算机、AI与软件工程的深邃海洋，记录每一次技术浪潮的涌动。</p>
            </div>
          </div>
          <div className="col col--6">
            <div className={clsx(styles.featureCard, styles.cardHover)}>
              <div className={styles.cardIcon}>🚢</div>
              <h3>未来浮标</h3>
              <p>在时代的浪潮中，寻找指引方向的灯塔，分享对未来的洞见与思考。</p>
            </div>
          </div>
          <div className="col col--6">
            <div className={clsx(styles.featureCard, styles.cardHover)}>
              <div className={styles.cardIcon}>🎯</div>
              <h3>职海观潮</h3>
              <p>记录从校园到职场的过渡历程，分享职业发展的经验与感悟。</p>
            </div>
          </div>
          <div className="col col--6">
            <div className={clsx(styles.featureCard, styles.cardHover)}>
              <div className={styles.cardIcon}>📚</div>
              <h3>比特龙书单</h3>
              <p>在数字与现实的交织中，寻找智慧的珍珠，分享阅读的收获。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="龙源记：潮生万象录 - 记录技术与生活的点滴">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
