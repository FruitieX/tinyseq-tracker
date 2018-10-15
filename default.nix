with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "tinyseq-tracker";
  env = buildEnv { name = name; paths = buildInputs; };
  buildInputs = [
    nodejs-10_x
  ];
}
