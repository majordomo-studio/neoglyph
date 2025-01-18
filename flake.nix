{
  inputs = {
    systems.url = "github:nix-systems/default";
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };

  outputs =
  {
    self,
    nixpkgs,
    systems,
  }:
  let
    forEachSystem =
      f: nixpkgs.lib.genAttrs (import systems) (system: f {
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      });
  in
  {
    devShells = forEachSystem (
      { pkgs }:
      {
        default = pkgs.mkShellNoCC {
          packages = with pkgs; [
            nodenv
            nodejs
            nodePackages.npm
            nodePackages.pnpm
          ];
        };
      }
    );
  };
}
