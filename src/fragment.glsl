precision lowp float;

// Z.x = time (m)
// Z.y = 0
// Z.z = first instrument envelope
uniform vec4 Z;

void main() {
  gl_FragColor.x = Z.x / 10.;
  gl_FragColor.y = Z.y;
  gl_FragColor.z = Z.z;
  gl_FragColor.w = 1.;
}
