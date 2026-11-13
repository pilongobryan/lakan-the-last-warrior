import React, { Suspense, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import './style.css';

const characters = [
  { image: 'assets/lakan.png', alt: 'Lakan character', role: 'SACRED GUARDIAN', name: 'LAKAN', description: 'A warrior whose journey begins with a search for identity, purpose, and balance.', button: 'Meet Sidapa' },
  { image: 'assets/sidapa.png', alt: 'Sidapa character', role: 'GOD OF DEATH', name: 'SIDAPA', description: "The God of Death and Ruler of Fate whose presence forms a central force in Lakan's journey.", button: 'Meet Lakan' },
];

const hotspots = [
  { id: 1, x: '25%', y: '35%', title: 'Zone A: Spawn & intro pathway', detail: 'Guiding player movement with subtle lighting and open sightlines.' },
  { id: 2, x: '55%', y: '50%', title: 'Zone B: Central chokepoint', detail: 'Strategic arena designed for balanced mobile action-RPG combat.' },
  { id: 3, x: '80%', y: '70%', title: 'Zone C: Boss arena ascent', detail: 'Elevated terrain leading to the final ascent towards Mt. Apo.' },
];
const projects = [
  { id: 1, title: 'Level 4 Environment Map Overview', category: 'level-design', tag: '3D Level Design', img: '/images/map-layout.png', desc: 'Full spatial layout and route planning for capstone story progression.' },
  { id: 2, title: '3D Greybox Blockout Mesh', category: 'blender', tag: 'Blender Props', desc: 'Greybox environment structural prototyping built inside Blender.' },
  { id: 3, title: 'Modular Environment Huts & Terrain', category: 'blender', tag: 'Blender Props', desc: 'Custom low-poly environment objects and modular terrain assets.' },
  { id: 4, title: 'Portfolio & Web Application Stack', category: 'web', tag: 'Web Development', desc: 'Interactive website built with React and Vite.' },
];
const workTabs = [{label:'All works',value:'all'},{label:'3D level design',value:'level-design'},{label:'Blender props',value:'blender'},{label:'Web apps',value:'web'}];


function CharacterModel({ wireframe }) {
  const { scene } = useGLTF('/LAKAN.glb');
  const model = useMemo(() => {
    const copy = cloneSkinned(scene);
    copy.traverse((node) => { if (node.isMesh && node.material) node.material = Array.isArray(node.material) ? node.material.map((mat) => mat.clone()) : node.material.clone(); });
    const box = new THREE.Box3().setFromObject(copy);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const largest = Math.max(size.x, size.y, size.z) || 1;
    copy.position.sub(center);
    const group = new THREE.Group(); group.add(copy); group.scale.setScalar(2.4 / largest); return group;
  }, [scene]);
  useEffect(() => { model.traverse((node) => { if (!node.isMesh) return; const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach((mat) => { mat.side = THREE.DoubleSide; mat.transparent = false; mat.opacity = 1; mat.depthWrite = true; mat.depthTest = true; if ('transmission' in mat) mat.transmission = 0; mat.wireframe = wireframe; mat.needsUpdate = true; }); }); }, [model, wireframe]);
  return <primitive object={model} />;
}

function ModelLoader() { const ref = React.useRef(); useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt; }); return <mesh ref={ref}><boxGeometry args={[1,1,1]} /><meshBasicMaterial color='#c89b3c' wireframe /></mesh>; }

class ViewerBoundary extends React.Component { state = { failed: false }; static getDerivedStateFromError() { return { failed: true }; } render() { return this.state.failed ? <div className='viewer-fallback'>LAKAN.glb could not be loaded. Check that it is in the public folder.</div> : this.props.children; } }

function ModelViewer() {
  const [wireframe, setWireframe] = useState(false); const [autoRotate, setAutoRotate] = useState(true); const [zoomOn, setZoomOn] = useState(false); const controlsRef = React.useRef();
  const resetCamera = () => { const controls = controlsRef.current; if (!controls) return; controls.object.position.set(0,0,4); controls.target.set(0,0,0); controls.update(); };
  return <section className='section archive-section' id='model'><div className='container'><div className='section-heading centered'><div className='section-label'>CHARACTER VIEWER</div><h2>Meet <span>Lakan in 3D.</span></h2><p>Drag to rotate. Scroll to zoom after clicking the viewer.</p></div><div className='viewer-controls'><button onClick={resetCamera}>Reset camera</button><button onClick={() => setAutoRotate(v => !v)} aria-pressed={autoRotate}>{autoRotate ? 'Pause spin' : 'Auto-spin'}</button><button onClick={() => setWireframe(v => !v)} aria-pressed={wireframe}>Wireframe {wireframe ? 'on' : 'off'}</button></div><div className='model-viewer' onPointerDown={() => setZoomOn(true)} onPointerLeave={() => setZoomOn(false)}><ViewerBoundary><Canvas dpr={[1,2]} camera={{position:[0,0,4],fov:45}}><hemisphereLight args={['#fff','#c9ced6',1.2]} /><directionalLight position={[5,6,5]} intensity={1.8}/><directionalLight position={[-5,2,-4]} intensity={0.6}/><Suspense fallback={<ModelLoader/>}><CharacterModel wireframe={wireframe}/></Suspense><ContactShadows position={[0,-1.22,0]} opacity={0.3} scale={7} blur={2.6} far={3}/><OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.08} enableZoom={zoomOn} minDistance={1.8} maxDistance={8} autoRotate={autoRotate} autoRotateSpeed={1.4}/></Canvas></ViewerBoundary></div></div></section>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [developer, setDeveloper] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [workTab, setWorkTab] = useState('all');
  const [mapFailed, setMapFailed] = useState(false);
  const character = characters[characterIndex];

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen || Boolean(developer));
    const onKeyDown = (event) => { if (event.key === 'Escape') { setMenuOpen(false); setDeveloper(null); } };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', onKeyDown); };
  }, [menuOpen, developer]);

  const closeMenu = () => setMenuOpen(false);
  const openDeveloper = (event) => { const card = event.currentTarget; setDeveloper({ image: card.getAttribute('data-image'), name: card.getAttribute('data-name') }); };
  const visibleProjects = workTab === 'all' ? projects : projects.filter((project) => project.category === workTab);

  return (
 <>
    <header className="site-header">
      <div className="container nav-wrap">
        

        <a href="#home" className="brand" aria-label="Lakan The Last Warrior">
          <img
            src="assets/lakan-logo.png"
            alt="Lakan: The Last Warrior"
            className="brand-logo"
          />
        </a>

        

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#story" onClick={closeMenu}> Story </a>

          <a href="#adventure" onClick={closeMenu}> Adventure </a>

          <a href="#features" onClick={closeMenu}> Features </a>

          <a href="#characters" onClick={closeMenu}> Characters </a>

          <a href="#team" onClick={closeMenu}> Developers </a>

          <a href="#download" onClick={closeMenu}> Download </a>
        </nav>

        

        <a href="#download" className="header-cta"> Get the game </a>

        

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      

      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        <a href="#story" onClick={closeMenu}> Story </a>

        <a href="#adventure" onClick={closeMenu}> Adventure </a>

        <a href="#features" onClick={closeMenu}> Features </a>

        <a href="#characters" onClick={closeMenu}> Characters </a>

        <a href="#team" onClick={closeMenu}> Developers </a>

        <a href="#download" onClick={closeMenu}> Download </a>
      </nav>
    </header>

    

    <main id="home">
      

      <section className="hero grain">
        <div className="container hero-grid">
          

          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line"></span>

              FILIPINO MYTHOLOGY • MOBILE ACTION-RPG
            </div>

            <h1>
              Lakan:

              <em> The Last Warrior </em>
            </h1>

            <p className="hero-description">
              Enter a myth-inspired world shaped by Filipino stories, warriors,
              creatures, values, and traditions.
            </p>

            <div className="hero-buttons">
              <a href="#download" className="btn btn-primary">
                DOWNLOAD THE GAME
              </a>

              <a href="#story" className="btn btn-secondary">
                DISCOVER THE STORY
              </a>
            </div>

            

            <div className="hero-facts">
              <div className="hero-fact">
                <strong> 10–19 </strong>

                <span> Target Age </span>
              </div>

              <div className="hero-fact">
                <strong> 6 </strong>

                <span> Story Levels </span>
              </div>

              <div className="hero-fact">
                <strong> Android 9+ </strong>

                <span> Platform </span>
              </div>
            </div>
          </div>

          

          <div className="hero-character-area">
            <div className="character-glow"></div>

            <div className="hero-character">
              <img
                src={character.image}
                alt={character.alt}
              />
            </div>

            

            <div className="character-switcher">
              <div className="character-label">
                <span >{character.role} </span>

                <h2 >{character.name}</h2>

                <p >{character.description}</p>
              </div>

              <button
                className="character-switch-button"
                onClick={() => setCharacterIndex((index) => 1 - index)}
                type="button"
              >
                <span>{character.button}</span>

                <span className="switch-arrow"> → </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      

      <ModelViewer />

      <section className="section story-section grain" id="story">
        <div className="container story-grid">
          <div className="story-visual">
            <div className="story-frame">
              <img src="assets/lakan.png" alt="Lakan" />

              <div className="story-frame-label">THE LAST WARRIOR</div>
            </div>
          </div>

          <div className="story-content">
            <div className="section-label">THE STORY</div>

            <h2>
              A warrior searching for
              <span> what was lost. </span>
            </h2>

            <p className="story-lead">
              Lakan: The Last Warrior follows the journey of Lakan, a Sacred
              Guardian caught in a conflict involving the balance of the mortal
              and divine worlds.
            </p>

            <p>
              At the heart of the story is the
              <strong> Alab ng Diwa </strong>
              — a divine energy that connects the heavens and the earth.
            </p>

            <p>
              As Lakan travels through different regions, he encounters
              creatures, characters, challenges, and fragments of a past that
              gradually reveal the truth behind his journey.
            </p>

            <div className="story-note">
              <span className="story-note-mark"> ✦ </span>

              <p>
                The adventure combines mythology, exploration, combat, and
                cultural discovery into one interactive experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      <section className="section adventure-section" id="adventure">
        <div className="container">
          <div className="section-heading">
            <div className="section-label">THE ADVENTURE</div>

            <h2>
              Explore a world built around

              <span> Filipino mythology. </span>
            </h2>

            <p>
              Travel through a six-level adventure where combat, exploration,
              quests, culture, and mythology come together.
            </p>
          </div>

          <div className="adventure-grid">
            <article className="adventure-card">
              <div className="adventure-number">01</div>

              <h3>Explore</h3>

              <p>
                Discover different environments, hidden areas, NPCs, quests, and
                challenges throughout the adventure.
              </p>
            </article>

            <article className="adventure-card">
              <div className="adventure-number">02</div>

              <h3>Fight</h3>

              <p>
                Take on enemies using real-time combat with Lakan's weapons and
                abilities.
              </p>
            </article>

            <article className="adventure-card">
              <div className="adventure-number">03</div>

              <h3>Discover</h3>

              <p>
                Learn about mythical creatures, cultural items, Filipino values,
                and important discoveries through the Mythological Almanac.
              </p>
            </article>

            <article className="adventure-card">
              <div className="adventure-number">04</div>

              <h3>Progress</h3>

              <p>
                Develop your character, complete quests, collect equipment, and
                improve your Tapang, Tatag, Liksi, and Talino.
              </p>
            </article>
          </div>
        </div>
      </section>

      

      <section className="section features-section grain" id="features">
        <div className="container">
          <div className="section-heading">
            <div className="section-label">CORE FEATURES</div>

            <h2>
              Built for

              <span> action and discovery. </span>
            </h2>

            <p>
              Lakan combines action-RPG systems with interactive cultural
              learning without giving away the adventure's major story moments.
            </p>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon">⚔</div>

              <h3>Real-Time Combat</h3>

              <p>
                Engage enemies through real-time melee and ranged combat using
                Lakan's available weapons and abilities.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">◈</div>

              <h3>Character Progression</h3>

              <p>
                Develop Lakan through the Talent System, improving Tapang,
                Tatag, Liksi, and Talino as you progress.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">✧</div>

              <h3>Mythological Almanac</h3>

              <p>
                Discover entries covering mythical creatures, items, equipment,
                Filipino values, and completed missions.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">◌</div>

              <h3>Exploration & Quests</h3>

              <p>
                Explore environments, complete main missions, and take on
                optional side quests for additional rewards and discoveries.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">◎</div>

              <h3>NPC Interaction</h3>

              <p>
                Meet characters throughout the adventure and interact with NPCs
                through dialogue and quest objectives.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">◐</div>

              <h3>Offline Gameplay</h3>

              <p>
                Play the game offline after installation, with local save
                functionality preserving your progress.
              </p>
            </article>
          </div>
        </div>
      </section>

      

      <section className="section knowledge-section">
        <div className="container">
          <div className="section-heading centered">
            <div className="section-label">KNOWLEDGE-ACTION LOOP</div>

            <h2>
              Discover.

              <span> Understand. Apply. </span>
            </h2>

            <p>
              The Mythological Almanac connects cultural knowledge with the
              player's actions throughout the game.
            </p>
          </div>

          <div className="knowledge-flow">
            <div className="knowledge-step">
              <span className="knowledge-number"> 01 </span>

              <h3>Discover</h3>

              <p>Encounter new cultural and mythological information.</p>
            </div>

            <div className="knowledge-connector">→</div>

            <div className="knowledge-step">
              <span className="knowledge-number"> 02 </span>

              <h3>Understand</h3>

              <p>Learn through the Mythological Almanac and exploration.</p>
            </div>

            <div className="knowledge-connector">→</div>

            <div className="knowledge-step">
              <span className="knowledge-number"> 03 </span>

              <h3>Apply</h3>

              <p>
                Use what you learn to support decisions, combat, and
                progression.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      <section className="section characters-section grain" id="characters">
        <div className="container">
          <div className="section-heading">
            <div className="section-label">CHARACTERS</div>

            <h2>
              The forces at the heart of

              <span> the story. </span>
            </h2>
          </div>

          <div className="characters-grid">
            

            <article className="character-card">
              <div className="character-image">
                <img src="assets/lakan.png" alt="Lakan" />
              </div>

              <div className="character-card-content">
                <span> SACRED GUARDIAN </span>

                <h3>Lakan</h3>

                <p>
                  The protagonist of the adventure and a Sacred Guardian whose
                  journey is tied to the balance of the world.
                </p>
              </div>
            </article>

            

            <article className="character-card sidapa-card">
              <div className="character-image">
                <img src="assets/sidapa.png" alt="Sidapa" />
              </div>

              <div className="character-card-content">
                <span> GOD OF DEATH </span>

                <h3>Sidapa</h3>

                <p>
                  The God of Death and Ruler of Fate whose presence forms a
                  central force in Lakan's journey.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
<section className="section archive-section" id="level-map">
      <div className="container">
        <div className="section-heading centered"><div className="section-label">LEVEL DESIGN</div><h2>Explore the <span>level map.</span></h2><p>Select a pin to learn about the purpose of each zone.</p></div>
        <div className="archive-map-layout">
          <div className="archive-map">
            {mapFailed ? <div className="archive-map-missing">Add <code>public/images/map-layout.png</code> to display the level map.</div> : <img src="/images/map-layout.png" alt="Overview of the Level 4 map" onError={() => setMapFailed(true)} />}
            {hotspots.map((pin) => <button key={pin.id} className={`archive-pin ${activeHotspot === pin.id ? 'selected' : ''}`} style={{left:pin.x,top:pin.y}} onClick={() => setActiveHotspot(activeHotspot === pin.id ? null : pin.id)} aria-label={pin.title} aria-pressed={activeHotspot === pin.id}>{pin.id}</button>)}
          </div>
          <div className="archive-hotspots">{hotspots.map((pin) => <button key={pin.id} className={`archive-hotspot ${activeHotspot === pin.id ? 'selected' : ''}`} onClick={() => setActiveHotspot(activeHotspot === pin.id ? null : pin.id)}><strong>{pin.title}</strong>{activeHotspot === pin.id && <span>{pin.detail}</span>}</button>)}{activeHotspot === null && <p className="archive-hint">Choose a zone or map pin to explore its design intent.</p>}</div>
        </div>
      </div>
    </section>


    


      <section className="section team-section" id="team">
        <div className="container">
          <div className="section-heading centered">
            <div className="section-label">THE DEVELOPERS</div>

            <h2>
              Meet the team behind
              <span> Lakan. </span>
            </h2>

            <p>
              Lakan: The Last Warrior was developed as a Bachelor of Science in
              Information Technology capstone project.
            </p>
          </div>

          <div className="team-grid">
            

            <button
              className="developer-card" type="button" data-image="assets/euly.png" data-name="Eulysies P. Domantay" onClick={openDeveloper}
              aria-label="View photo of Eulysies P. Domantay"
            >
              <div className="developer-photo">
                <img src="assets/euly.png" alt="" />
              </div>

              <div className="developer-info">
                <span> PROPONENT & UI/UX DESIGNER </span>

                <h3>Eulysies P. Domantay</h3>
              </div>
            </button>

            

            <button
              className="developer-card" type="button" data-image="assets/efren.png" data-name="Efren B. Lamoste Jr." onClick={openDeveloper}
              aria-label="View photo of Efren B. Lamoste Jr."
            >
              <div className="developer-photo">
                <img src="assets/efren.png" alt="" />
              </div>

              <div className="developer-info">
                <span> PROPONENT & DOCUMENT SPECIALIST </span>

                <h3>Efren B. Lamoste Jr.</h3>
              </div>
            </button>

            

            <button
              className="developer-card" type="button" data-image="assets/michael.png" data-name="Michael M. Mendoza" onClick={openDeveloper}
              aria-label="View photo of Michael M. Mendoza"
            >
              <div className="developer-photo">
                <img src="assets/michael.png" alt="" />
              </div>

              <div className="developer-info">
                <span> PROPONENT & GAME DEVELOPER </span>

                <h3>Michael M. Mendoza</h3>
              </div>
            </button>

            

            <button
              className="developer-card" type="button" data-image="assets/bryan.png" data-name="Bryan Julius H. Pilongo" onClick={openDeveloper}
              aria-label="View photo of Bryan Julius H. Pilongo"
            >
              <div className="developer-photo">
                <img src="assets/bryan.png" alt="" />
              </div>

              <div className="developer-info">
                <span> PROPONENT & LEVEL DESIGNER </span>

                <h3>Bryan Julius H. Pilongo</h3>
              </div>
            </button>
          </div>

          

          <div className="team-footer">
            <div className="team-line"></div>

            <p>Bachelor of Science in Information Technology</p>

            <p>College of Computer Studies</p>

            <p>Pambayang Dalubhasaan ng Marilao</p>

            <strong> August 2026 </strong>
          </div>
        </div>
      </section>

      

      <div className={`photo-lightbox ${developer ? 'open' : ''}`} aria-hidden={!developer} onClick={(event) => { if (event.target === event.currentTarget) setDeveloper(null); }}>
      <button className="lightbox-close" type="button" aria-label="Close photo" onClick={() => setDeveloper(null)}>?</button>
      <div className="lightbox-content"><img src={developer?.image || ''} alt={developer?.name || ''} /><p>{developer?.name}</p></div>
    </div>

      

      

      <section className="section download-section grain" id="download">
        <div className="container download-container">
          <div className="section-heading centered">
            <div className="section-label">DOWNLOAD</div>

            <h2>Step into the world of <em>Lakan.</em></h2>

            <p>
              Experience the adventure on Android and discover a game inspired
              by Filipino mythology and culture.
            </p>
          </div>

          <div className="download-card">
            

            <div className="download-character">
              <div className="download-character-glow"></div>

              <img src="assets/lakan.png" alt="Lakan" />
            </div>

            

            <div className="download-content">
              <div className="download-platform">ANDROID</div>

              <h3>Android</h3>

              <p className="download-version">Android 9 or later</p>

              <a
                href="https://spotibai.com/home"
                className="download-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                DOWNLOAD APK
              </a>
              <p className="download-note">Click the download link to be redirected to the download page.</p>

              <div className="download-specs">
                <div className="download-spec">
                  <span>PLATFORM</span>
                  <strong>Android 9+</strong>
                </div>

                <div className="download-spec">
                  <span>RAM</span>
                  <strong>4GB Recommended</strong>
                </div>

                <div className="download-spec">
                  <span>STORAGE</span>
                  <strong>4–6GB Available</strong>
                </div>

                <div className="download-spec">
                  <span>MODE</span>
                  <strong>Offline</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div className="container footer-content">
        <a href="#home" className="footer-brand">
          <img src="assets/lakan-logo.png" alt="Lakan: The Last Warrior" />
        </a>

        <p>© 2026 Lakan: The Last Warrior</p>

        <a href="#home" className="back-top"> Back to top ↑ </a>
      </div>
    </footer>
  </>
);
}
