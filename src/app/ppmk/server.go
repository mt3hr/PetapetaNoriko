//go:build server

package ppmk

import (
	"log"

	"github.com/spf13/cobra"
)

var (
	cmd = &cobra.Command{
		Use: "ppmk",
		PersistentPreRun: func(_ *cobra.Command, _ []string) {
		},
		Run: func(_ *cobra.Command, _ []string) {
			if err := launchServer(); err != nil {
				log.Fatal(err)
			}
		},
	}
)
