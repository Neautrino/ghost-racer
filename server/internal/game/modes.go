package game

type Mode struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Difficulty string `json:"difficulty"`
}

var modes = []Mode{
	{ID: "m1", Name: "Easy", Difficulty: "easy"},
	{ID: "m2", Name: "Medium", Difficulty: "medium"},
	{ID: "m3", Name: "Hard", Difficulty: "hard"},
}

func GetModes() []Mode {
	return modes
}

func ModeByID(id string) (Mode, bool) {
	for _, mode := range modes {
		if mode.ID == id {
			return mode, true
		}
	}
	return Mode{}, false
}
