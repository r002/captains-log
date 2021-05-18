package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"time"
)

type Commit struct {
	Version string `json:"version"`
	Message string `json:"message"`
	Built   string `json:"built"`
}

func main() {
	b, err := os.ReadFile("./src/data/changelog.json")
	if err != nil {
		log.Fatal(err)
	}

	var commits []Commit
	_ = json.Unmarshal(b, &commits)

	t := time.Now()
	commits[0].Built = t.Format(time.RFC1123)
	commitMessage := "🔖 " + commits[0].Version + ": " + commits[0].Message

	fmt.Println("\t>> Commit message:", commitMessage)
	fmt.Println("\t>> Built:", commits[0].Built)

	// Generate the output changelog.json file
	output, _ := json.MarshalIndent(commits, "", "  ")
	err = os.WriteFile("./src/data/changelog.json", output, 0644)
	if err != nil {
		log.Fatal(err)
	}

	exec.Command("git", "add", ".").Run()
	runCommand(commitMessage)
	exec.Command("git", "push").Run()

	fmt.Println("\t>> Script finished running!")
}

func runCommand(message string) {
	app := "git"
	arg0 := "commit"
	arg1 := "-m"
	arg2 := message
	stdout, err := exec.Command(app, arg0, arg1, arg2).Output()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(string(stdout))
}
