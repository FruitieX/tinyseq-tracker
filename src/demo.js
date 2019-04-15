WIDTH = 1280;
HEIGHT = 720;
//document.write`<canvas id=W>`;

W.style.height = '100vh';
W.style.margin = -8;
(W.width = WIDTH), (W.height = HEIGHT);

for (i in (A = new AudioContext())) A[i[0] + i[6]] = A[i];
for (i in (g = W.getContext`webgl`)) g[i[0] + i[6]] = g[i];

// NOTE: 2nd argument to drawArrays used to be 0, but undefined works
(R = t =>
  g.drawArrays(
    // g.TRIANGLE_FAN = 6
    6,

    // a.xy = resolution
    // a.z = time (s)
    // a.w = bass
    g.uniform4f(
      // g.getUniformLocation
      g.gf(P, 'Z'),
      1,
      i.node && i.node.parameters.get('f').value / 1000,
      1,
      // A.currentTime,
      // framerate independent moving average:
      // https://www.gamedev.net/forums/topic/499983-smooth-framerate-independent-chase-camera/#comment-4261584
      //b = B * b + (1 - B) * I[0].e.gain.value,

      (Z = requestAnimationFrame(R, (T = t))),
    ),

    // number of indices to be rendered
    3,
  )),
  // g.createProgram
  (P = g.cP());

// fragment shader, g.FRAGMENT_SHADER = g.FN = 35632
g.sS((S = g.cS(g.FN)), require('./fragment.glsl'));
g.ce(S);
g.aS(P, S);

// #ifdef DEV
// Log compilation errors
if (!g.getShaderParameter(S, 35713)) {
  // COMPILE_STATUS = 35713
  throw g.getShaderInfoLog(S);
}
// #endif

// vertex shader, g.VERTEX_SHADER = 35633 = g.FN+1
// g.shaderSource = g.sS, g.createShader = g.cS
g.sS((S = g.cS(g.FN + 1)), require('./vertex.glsl'));
// g.compileShader = g.ce, g.aS = g.attachShader
g.ce(S);
g.aS(P, S);

//c.parentElement.style = 'cursor:none;margin:0;overflow:hidden';

// #6
// g.vertexAttribPointer = g.vA
g.vA(
  // #2 Return value not used (undefined => 0)
  // g.enableVertexAttribArray = g.eV
  g.eV(
    // #1 Return value not used (undefined => 0)
    // g.ARRAY_BUFFER = 34962
    // g.bindBuffer = g.bf, g.createBuffer = g.cB
    g.bf(34962, g.cB()),
  ),
  2,
  // g.BYTE = 5120
  5120,

  // #3 Return value not used (undefined => 0)
  // g.ARRAY_BUFFER = 34962
  // g.STATIC_DRAW = 35044
  // g.bufferData = g.bD
  g.bD(34962, Int8Array.of(-3, 1, 1, -3, 1, 1), 35044),

  // #4 Return value not used (undefined => 0)
  // g.linkProgram = g.lo
  g.lo(P),

  // #5 Return value not used (undefined => 0)
  // g.useProgram = g.ug
  g.ug(P),
);

// render first frame
R(0);
