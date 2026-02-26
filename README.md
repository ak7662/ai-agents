commands for adding ssh key in mac

ssh-keygen -t ed25519 -C "ak7662@gmail.com"
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
pbcopy < ~/.ssh/id_ed25519.pub

ollama commands 

ollama --version
which ollama -- If installed → returns a path like /usr/local/bin/ollama
ollama list -- Check if the Ollama service is running - If installed and running → shows available models, If installed but not running → asks to start the service , If not installed → command not found
ollama serve -- start it from terminal