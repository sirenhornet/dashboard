#!/bin/bash

cd
mkdir -p ~/bin ~/.local/bin
export PATH=$PATH:~/bin:~/.local/bin

# install tools
if ! command -v unzip; then
	sudo apt-get install -y unzip
fi
# bun
if ! command -v bun; then
	curl -fsSL https://bun.sh/install | bash
	export PATH=$PATH:~/.bun/bin
	echo 'export PATH=$PATH:~/.bun/bin' >> ~/.bashrc
fi
