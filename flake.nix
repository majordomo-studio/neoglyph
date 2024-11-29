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
            vscode
            firebase-tools
            nodenv
            nodejs
            nodePackages.npm
            nodePackages.pnpm
            electron
            python3
          ];

          # VSCode extension installation
          shellHook = ''
            mkdir -p .vscode/extensions
            code --install-extension catppuccin.catppuccin-vsc --force
            # Add more extensions here as needed
          '';
        };
      }
    );
  };
}
