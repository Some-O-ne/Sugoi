import_code("/libs/math.gs")
import_code("/libs/builtinplus.gs")
import_code("/libs/color.gs")
import_code("/libs/checks.gs")
import_code("/libs/sessions.gs")
import_code("/libs/commands.gs")
import_code("/libs/cgui.gs")
// /libs folder? you mean /lib? or /libs that you made for this code?
// either way, I recomend keeping your importable code compiled and in your home folder.

_ = function(d)
	c = new color
	c.HSVfill(math.clamp(d*360,0,360),0.5,1)
	return c
end function

cgui.logo(true,100,@_,"Sugoi!")
print
cgui.theme()
print
while true
	input = user_input(cgui.prompt).split(" ")
	if input.len < 1 then continue
	error = commands.tryExecute(input[0],input[1:])
end while
