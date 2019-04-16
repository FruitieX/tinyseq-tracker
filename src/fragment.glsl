precision lowp float;

// Z.xy = resolution
// Z.z = time (s)
// Z.w = bass
uniform vec4 Z;

void main() {
  gl_FragColor = Z;
}
