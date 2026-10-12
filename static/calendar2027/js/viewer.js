/* Standalone, demand-rendered viewer. All asset URLs come from Django's static tag. */
(() => {
  'use strict';
  const root = document.getElementById('calendar2027-viewer');
  if (!root) return;
  const stage = root.querySelector('.calendar-viewer__stage');
  const sceneHost = root.querySelector('.calendar-viewer__scene');
  const fallback = root.querySelector('.calendar-viewer__fallback');
  const image = fallback.querySelector('img');
  const loading = root.querySelector('.calendar-viewer__loading');
  const previous = root.querySelector('.calendar-viewer__previous');
  const next = root.querySelector('.calendar-viewer__next');
  const label = root.querySelector('.calendar-viewer__label');
  const count = root.querySelector('.calendar-viewer__count');
  const dotsHost = root.querySelector('.calendar-viewer__dots');
  const strings = root.dataset.language === 'sk' ? {
    loading: 'Načítava sa strana…', turning: 'Otáča sa strana…',
    error: 'Stranu sa nepodarilo načítať. Skúste to znova.',
    dot: name => `Prejsť na stranu ${name}, 2027`,
    stage: name => `${name}, kalendár 2027. Na otáčanie strán použite šípky doľava a doprava. Enter otvorí stranu v plnom rozlíšení.`,
    image: name => `${name} kalendára divokej prírody Filipa Bajaceka na rok 2027`
  } : {
    loading: 'Loading page…', turning: 'Turning page…',
    error: 'Page could not load. Please try again.',
    dot: name => `Go to ${name}, 2027`,
    stage: name => `${name}, 2027 calendar. Use left and right arrow keys to turn pages. Press Enter to open the full-size page.`,
    image: name => `${name} of Filip Bajacek's 2027 wildlife calendar`
  };
  const pages = Array.from(root.querySelectorAll('.calendar-viewer__pages li'), el => ({
    label: el.dataset.label, src: el.dataset.src
  }));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const mobileLayout = matchMedia('(max-width: 750px)');
  const events = new AbortController();
  const listen = (el, type, fn, options = {}) => el.addEventListener(type, fn, { ...options, signal: events.signal });
  let current = 0;
  let busy = true;
  let disposed = false;
  let graphics = null;
  let gesture = null;
  const dots = pages.map((page, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'calendar-viewer__dot';
    dot.setAttribute('aria-label', strings.dot(page.label));
    dot.title = page.label;
    dot.disabled = true;
    listen(dot, 'click', () => goToPage(index));
    dotsHost.append(dot);
    return dot;
  });
  dotsHost.hidden = false;
  updateDots();

  function updateDots() {
    dots.forEach((dot, index) => {
      if (index === current) dot.setAttribute('aria-current', 'page');
      else dot.removeAttribute('aria-current');
    });
  }

  function setBusy(value, message = strings.loading) {
    busy = value;
    stage.setAttribute('aria-busy', String(value));
    loading.textContent = message;
    loading.hidden = !value;
    previous.disabled = next.disabled = value;
    dots.forEach(dot => { dot.disabled = value; });
  }

  function announce() {
    label.textContent = `${pages[current].label} / 2027`;
    count.textContent = `${current + 1} / ${pages.length}`;
    stage.setAttribute('aria-label', strings.stage(pages[current].label));
    image.alt = strings.image(pages[current].label);
    image.src = pages[current].src;
    updateDots();
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const loaded = new Image();
      loaded.decoding = 'async';
      loaded.onload = () => resolve(loaded);
      loaded.onerror = () => reject(new Error('Calendar page could not be loaded'));
      loaded.src = src;
    });
  }

  function navigate(direction) {
    return goToPage((current + direction + pages.length) % pages.length, direction);
  }

  async function goToPage(target, direction = Math.sign(target - current)) {
    if (busy || disposed || !Number.isInteger(target) || target < 0 || target >= pages.length || target === current) return;
    graphics?.center();
    setBusy(true);
    try {
      if (graphics) {
        const viewer = graphics;
        const texture = await viewer.texture(target);
        if (disposed) return;
        // Context loss can switch to 2D while a texture is loading.
        if (graphics === viewer) {
          setBusy(true, strings.turning);
          await viewer.turn(target, texture, direction);
        }
        else await loadImage(pages[target].src);
      } else {
        await loadImage(pages[target].src);
      }
      if (disposed) return;
      current = target;
      announce();
      setBusy(false);
      graphics?.preload();
    } catch (error) {
      if (disposed) return;
      setBusy(false);
      loading.hidden = false;
      loading.textContent = strings.error;
      console.warn('Calendar viewer:', error.message);
    }
  }

  listen(previous, 'click', () => navigate(-1));
  listen(next, 'click', () => navigate(1));
  // Full-resolution viewing remains available without a visible link.
  const openFullPage = () => {
    if (!busy && !disposed) window.open(pages[current].src, '_blank', 'noopener');
  };
  listen(sceneHost, 'dblclick', () => {
    if (finePointer.matches && !mobileLayout.matches) openFullPage();
  });
  // Keyboard handling is scoped to this component, never the document.
  listen(root, 'keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
        event.target.closest('a, input, textarea, select, [contenteditable]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Enter' && event.target === stage) {
      event.preventDefault();
      openFullPage();
    }
  });
  listen(stage, 'pointerdown', event => {
    if (!event.isPrimary || event.pointerType === 'mouse' || event.target.closest('button')) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    stage.setPointerCapture(event.pointerId);
  });
  listen(stage, 'pointerup', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) > Math.max(45, stage.clientWidth * .12) && Math.abs(dx) > Math.abs(dy) * 1.5) {
      navigate(dx < 0 ? 1 : -1);
    }
  });
  listen(stage, 'pointercancel', () => { gesture = null; });
  listen(stage, 'lostpointercapture', () => { gesture = null; });

  async function createGraphics(THREE) {
    const width = 2.97;
    const height = width * 2532 / 1800; // Exact rendered PDF aspect ratio, without cropping.
    const top = height / 2;
    const hingeZ = .17;
    const rows = 64;
    const columns = 8;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 50);
    const textureCache = new Map();
    let destroyed = false;
    let frame = 0;
    let animation = null;
    let visible = true;
    let lastFrame = 0;
    let distance = 9;
    const targetView = { x: 0, y: 0 };
    const view = { x: 0, y: 0 };
    const hoverRay = new THREE.Raycaster();
    const hoverPoint = new THREE.Vector2();
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(0xdcd7cd);
    renderer.domElement.setAttribute('aria-hidden', 'true');

    // Fine neutral plaster generated locally, with no external environment maps.
    const wallCanvas = document.createElement('canvas');
    wallCanvas.width = wallCanvas.height = 128;
    const context = wallCanvas.getContext('2d');
    const pixels = context.createImageData(128, 128);
    let seed = 2027;
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const grain = (seed / 4294967296 - .5) * 5;
      pixels.data[i] = 221 + grain;
      pixels.data[i + 1] = 217 + grain;
      pixels.data[i + 2] = 209 + grain;
      pixels.data[i + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    const plaster = new THREE.CanvasTexture(wallCanvas);
    plaster.colorSpace = THREE.SRGBColorSpace;
    plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping;
    plaster.repeat.set(14, 14);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({
      map: plaster, roughness: 1
    }));
    wall.position.z = -.055;
    wall.receiveShadow = true;
    scene.add(wall);
    scene.add(new THREE.AmbientLight(0xffffff, 2.1));
    const light = new THREE.DirectionalLight(0xfffaf1, 2.3);
    light.position.set(-3.5, 6, 7);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    Object.assign(light.shadow.camera, { left: -5, right: 5, top: 7, bottom: -4, near: .5, far: 20 });
    light.shadow.bias = -.0003;
    light.shadow.normalBias = .012;
    light.shadow.radius = 3;
    scene.add(light);

    const paper = new THREE.MeshStandardMaterial({ color: 0xf3f0e9, roughness: .65 });
    const stack = new THREE.Mesh(new THREE.BoxGeometry(width, height, .055), paper);
    stack.position.z = .108;
    stack.castShadow = stack.receiveShadow = true;
    scene.add(stack);
    // Separate thin edge layers imply the remaining sheets without adding full meshes.
    const edgeGeometry = new THREE.BoxGeometry(width + .006, .003, .045);
    for (let i = 0; i < 7; i++) {
      const edge = new THREE.Mesh(edgeGeometry, paper);
      edge.position.set(0, -top + .003 * i, .084 + i * .004);
      scene.add(edge);
    }
    // Printed ink is unlit for faithful PDF colors. A faint lit clear layer suggests gloss.
    const pageMaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide, toneMapped: false });
    const base = new THREE.Mesh(new THREE.PlaneGeometry(width, height), pageMaterial);
    base.position.z = .141;
    base.castShadow = true;
    scene.add(base);
    const sheen = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transparent: true, opacity: .018, roughness: .5,
      metalness: 0, clearcoat: .18, depthWrite: false
    }));
    sheen.position.z = .143;
    scene.add(sheen);

    const geometry = new THREE.PlaneGeometry(width, height, columns, rows);
    geometry.translate(0, -top, 0);
    const turnMaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide, toneMapped: false });
    const backMaterial = new THREE.MeshStandardMaterial({ color: 0xf9f7f1, side: THREE.BackSide, roughness: .55 });
    const sheet = new THREE.Group();
    sheet.position.set(0, top, hingeZ);
    const front = new THREE.Mesh(geometry, turnMaterial);
    const back = new THREE.Mesh(geometry, backMaterial);
    front.castShadow = back.castShadow = true;
    sheet.add(front, back);
    sheet.visible = false;
    scene.add(sheet);

    // White painted metal loops lie in the YZ plane around the top edge.
    const wire = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: .3, roughness: .28 });
    const loopGeometry = new THREE.TorusGeometry(.067, .007, 6, 20);
    const loops = new THREE.InstancedMesh(loopGeometry, wire, 32);
    const transform = new THREE.Object3D();
    for (let i = 0; i < 32; i++) {
      transform.position.set(-width / 2 + .055 + i * (width - .11) / 31, top + .009, .112);
      transform.rotation.y = Math.PI / 2;
      transform.updateMatrix();
      loops.setMatrixAt(i, transform.matrix);
    }
    loops.castShadow = true;
    scene.add(loops);
    const hangerCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-.24, top + .035, .12), new THREE.Vector3(-.15, top + .11, .12),
      new THREE.Vector3(0, top + .26, .095), new THREE.Vector3(.15, top + .11, .12),
      new THREE.Vector3(.24, top + .035, .12)
    ]);
    const hanger = new THREE.Mesh(new THREE.TubeGeometry(hangerCurve, 24, .008, 6, false), wire);
    hanger.castShadow = true;
    scene.add(hanger);
    const hook = new THREE.Mesh(new THREE.SphereGeometry(.028, 12, 8), new THREE.MeshStandardMaterial({
      color: 0xb8b4ab, metalness: .65, roughness: .4
    }));
    hook.position.set(0, top + .253, .071);
    hook.castShadow = true;
    scene.add(hook);

    const smooth = value => value * value * (3 - 2 * value);
    const positions = geometry.attributes.position;
    // Integrate a sheet's centerline. Phase 1 lifts around the fixed top hinge;
    // phase 2 travels a tight fold from the free edge back to the wire, leaving
    // the sheet hanging behind the stack. The curve never passes through the wall.
    // The front has printed UVs; a separate blank reverse avoids mirrored text.
    function bend(progress) {
      const lifting = progress <= .62;
      const phase = lifting ? progress / .62 : (progress - .62) / .38;
      const angle = lifting ? Math.PI * smooth(phase) : Math.PI;
      const foldLength = .155;
      const foldStart = height * (1 - smooth(phase));
      let y = 0;
      let z = 0;
      const segment = height / rows;
      // Multiple integration samples per row keep the binding-radius fold smooth.
      for (let row = 0; row <= rows; row++) {
        if (row > 0) {
          for (let sample = 0; sample < 8; sample++) {
            const s = (row - 1 + (sample + .5) / 8) * segment;
            const theta = lifting
              ? angle + .14 * Math.sin(Math.PI * phase) * s / height
              : Math.PI + Math.PI * smooth(Math.min(1, Math.max(0, (s - foldStart) / foldLength)));
            y -= Math.cos(theta) * segment / 8;
            z += Math.sin(theta) * segment / 8;
          }
        }
        for (let col = 0; col <= columns; col++) {
          const index = row * (columns + 1) + col;
          positions.setXYZ(index, -width / 2 + col * width / columns, y, z);
        }
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      // Dynamic bounds prevent frustum culling a sheet which has lifted upward.
      geometry.computeBoundingSphere();
    }

    function requestRender() {
      if (!frame && !destroyed && visible && !document.hidden) frame = requestAnimationFrame(render);
    }
    function render(now) {
      frame = 0;
      if (destroyed) return;
      const dt = Math.min((now - lastFrame) / 1000 || .016, .05);
      lastFrame = now;
      const damping = 1 - Math.exp(-8 * dt);
      view.x += (targetView.x - view.x) * damping;
      view.y += (targetView.y - view.y) * damping;
      camera.position.set(Math.sin(view.x) * distance, -.015 + Math.sin(view.y) * distance, Math.cos(view.x) * Math.cos(view.y) * distance);
      camera.lookAt(0, -.015, .1);
      if (animation) {
        const t = Math.min(1, (now - animation.start) / 1050);
        bend(animation.forward ? t : 1 - t);
        if (t === 1) {
          base.material.map = animation.texture;
          base.material.needsUpdate = true;
          sheet.visible = false;
          sheen.visible = true;
          const resolve = animation.resolve;
          animation = null;
          resolve();
        }
      }
      renderer.render(scene, camera);
      if (animation || Math.abs(targetView.x - view.x) + Math.abs(targetView.y - view.y) > .00004) requestRender();
    }
    function resize() {
      if (destroyed) return;
      const w = sceneHost.clientWidth;
      const h = sceneHost.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Leave desktop headroom for the hanging pin, including at full pointer tilt.
      const verticalPadding = mobileLayout.matches ? .65 : .95;
      distance = Math.max((height + verticalPadding) / 2, (width + .6) / (2 * camera.aspect)) / Math.tan(THREE.MathUtils.degToRad(17));
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, finePointer.matches && !mobileLayout.matches ? 2 : 1.5));
      renderer.setSize(w, h, false);
      requestRender();
    }
    function resetView(immediate = false) {
      const moving = Math.abs(targetView.x) + Math.abs(targetView.y) + Math.abs(view.x) + Math.abs(view.y) > .00004;
      targetView.x = targetView.y = 0;
      if (immediate === true || !moving) view.x = view.y = 0;
      if (moving) requestRender();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(sceneHost);
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) requestRender();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    intersection.observe(stage);
    const graphicsEvents = new AbortController();
    stage.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || !finePointer.matches || mobileLayout.matches || reducedMotion.matches) return;
      if (busy || event.target.closest('button')) { resetView(); return; }
      const rect = sceneHost.getBoundingClientRect();
      hoverPoint.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height * 2 - 1));
      hoverRay.setFromCamera(hoverPoint, camera);
      // Test the actual printed sheet, rather than the surrounding wall or controls.
      const hit = hoverRay.intersectObject(base, false)[0];
      if (!hit) { resetView(); return; }
      targetView.x = (hit.uv.x * 2 - 1) * THREE.MathUtils.degToRad(6);
      targetView.y = (hit.uv.y * 2 - 1) * THREE.MathUtils.degToRad(3);
      requestRender();
    }, { signal: graphicsEvents.signal });
    stage.addEventListener('pointerleave', resetView, { signal: graphicsEvents.signal });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else requestRender();
    }, { signal: graphicsEvents.signal });
    const motionChanged = () => {
      resetView();
      if (reducedMotion.matches && animation) animation.start = performance.now() - 1050;
      requestRender();
    };
    reducedMotion.addEventListener('change', motionChanged);
    finePointer.addEventListener('change', resetView);
    mobileLayout.addEventListener('change', resetView);

    async function texture(index) {
      if (!textureCache.has(index)) {
        const entry = { texture: null, promise: null };
        entry.promise = loadImage(pages[index].src).then(loaded => {
          if (destroyed) throw new Error('Viewer closed');
          let source = loaded;
          // Mobile retains three ~1024px textures instead of three full GPU images.
          const maxWidth = Math.floor(Math.min(
            renderer.capabilities.maxTextureSize * loaded.width / loaded.height,
            renderer.capabilities.maxTextureSize, finePointer.matches && !mobileLayout.matches ? 1800 : 1024
          ));
          if (loaded.width > maxWidth) {
            source = document.createElement('canvas');
            source.width = maxWidth;
            source.height = Math.round(loaded.height * maxWidth / loaded.width);
            source.getContext('2d').drawImage(loaded, 0, 0, source.width, source.height);
          }
          const result = new THREE.Texture(source);
          result.colorSpace = THREE.SRGBColorSpace;
          result.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          result.needsUpdate = true;
          entry.texture = result;
          return result;
        }).catch(error => { textureCache.delete(index); throw error; });
        textureCache.set(index, entry);
      }
      return textureCache.get(index).promise;
    }
    const nearbyPages = () => new Set([current, (current + pages.length - 1) % pages.length, (current + 1) % pages.length]);
    function preload() {
      const keep = nearbyPages();
      for (const [index, entry] of textureCache) {
        if (!keep.has(index) && entry.texture) {
          entry.texture.dispose();
          textureCache.delete(index);
        }
      }
      for (const index of keep) {
        if (index !== current) texture(index).then(() => {
          // A delayed preload may finish after navigation has already moved on.
          if (!nearbyPages().has(index) && !animation) {
            textureCache.get(index)?.texture?.dispose();
            textureCache.delete(index);
          }
        }).catch(() => {});
      }
    }
    function turn(target, targetTexture, direction) {
      if (reducedMotion.matches) {
        base.material.map = targetTexture;
        base.material.needsUpdate = true;
        requestRender();
        return Promise.resolve();
      }
      const forward = direction > 0;
      turnMaterial.map = forward ? base.material.map : targetTexture;
      turnMaterial.needsUpdate = true;
      if (forward) { base.material.map = targetTexture; base.material.needsUpdate = true; }
      sheet.visible = true;
      sheen.visible = false;
      bend(forward ? 0 : 1);
      return new Promise(resolve => {
        animation = { forward, texture: targetTexture, start: performance.now(), resolve };
        requestRender();
      });
    }
    function destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(frame);
      animation?.resolve();
      animation = null;
      graphicsEvents.abort();
      resizeObserver.disconnect();
      intersection.disconnect();
      reducedMotion.removeEventListener('change', motionChanged);
      finePointer.removeEventListener('change', resetView);
      mobileLayout.removeEventListener('change', resetView);
      const geometries = new Set();
      const materials = new Set();
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) materials.add(object.material);
      });
      geometries.forEach(item => item.dispose());
      materials.forEach(item => item.dispose());
      textureCache.forEach(entry => entry.texture?.dispose());
      plaster.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    }
    renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      graphics = null;
      destroy();
      fallback.hidden = false;
      announce();
      setBusy(false);
    }, { signal: graphicsEvents.signal });
    try {
      base.material.map = await texture(current);
      base.material.needsUpdate = true;
      if (disposed || destroyed) { destroy(); return null; }
      sceneHost.append(renderer.domElement);
      resize();
      // Render the first frame before hiding the useful HTML image.
      camera.position.set(0, -.015, distance);
      camera.lookAt(0, -.015, .1);
      renderer.render(scene, camera);
      fallback.hidden = true;
      return { texture, turn, preload, destroy, resize, center: () => resetView(true) };
    } catch (error) {
      destroy();
      throw error;
    }
  }

  listen(window, 'pagehide', event => {
    if (event.persisted) return; // Keep a working viewer when restored from bfcache.
    disposed = true;
    graphics?.destroy();
    events.abort();
  });
  listen(window, 'pageshow', () => graphics?.resize());
  (async () => {
    try {
      const THREE = await import(root.dataset.threeModule);
      if (disposed) return;
      graphics = await createGraphics(THREE);
      graphics?.preload();
    } catch (error) {
      // Dynamic import, WebGL2, or rendering failure leaves functional HTML navigation.
      fallback.hidden = false;
      console.info('Calendar viewer: using the 2D preview.', error.message);
    }
    if (!disposed) setBusy(false);
  })();
})();
