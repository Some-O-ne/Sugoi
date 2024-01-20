import_code("color.gs")
import_code("checks.gs")
import_code("builtinplus.gs")
import_code("theme.gs")
import_code("sessions.gs")
cgui = {}

cgui.logo = function(centered, size, colorFunction, text)
	logo = ""

	if centered then
		logo = logo + "<align=center>"
	end if

	logo = logo + "<size=" + size + "px>"
	logo = logo + text.color(@colorFunction)
	print(logo)
end function

cgui.theme = function()
	text = ""

	for c in theme
		text = text + c.key.color(@c.value) + " "
	end for

	print(text)
end function

cgui.question = function(question = "No question, try to guess from context: ", options = ["y", "n"], displayname = null, cantEscape = false, color = null)
	
	if not color then
		color = theme.highlightA
	end if
	input = ""
	displayoptions = options.join("/")
	
	if displayname then
		displayoptions = displayname
	end if
	
	if not cantEscape then
		displayoptions = displayoptions + "/q"
	end if
	text = (question + " (" + displayoptions + ") :").color(color)

	while true
		input = user_input(text)
		if input.matchesplus("(" + (options+displayoptions.split("/")).join("|") + ")") then
			break
		end if
	end while

	return input.replace("q", "")
end function

cgui.list = function(elements = [""],question="", cantEscape = false, color = null)
	if not @color then color = theme.highlightB
	if question then print(question.color(@color))
	displayElements = elements
	if cantEscape then displayElements.push("Exit")
	text = ""
	for element in displayElements
		text = text + ("["+ __element_idx+"]: ").color(@color)+element+"\n"	
	end for
	index= char(0) // just a magic number
	// because "a".to_int = "a" and if a is in options then it would go wrong
	while not elements.hasIndex(index.to_int)
		index = user_input(text)
		if index.to_int == displayElements.last then return null 
	end while
	return index.to_int
end function


// もっと!

cgui.prompt = function()
	s = sessions.getCurrentSession
	prompt = "——<mspace=9px>—[</mspace>"
	prompt = prompt + typeof(s.object).upper[0].color(theme.highlightA)
	prompt = prompt + "<mspace=7px>]—[</mspace>"
	prompt = prompt + s.user.color(theme.highlightB)
	prompt = prompt + "<mspace=7px>]—[</mspace>"
	prompt = prompt + s.globalIP.color(theme.highlightA)
	prompt = prompt + " -<mspace=1px>-></mspace> "
	prompt = prompt + s.localIP.color(theme.highlightB)
	prompt = prompt + "<mspace=7px>]—(</mspace>"
	prompt = prompt + s.dir.color(theme.light)
	prompt = prompt + ")<pos=-5px><voffset=-8px>|<pos=-5px><voffset=-24px>|<voffset=-33px><pos=0px>———<space=-7px><voffset=-35px>> "
	return prompt.color(theme.base)
end function
