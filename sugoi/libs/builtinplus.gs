
import_code("checks.gs")

list.map = function(callback)
	for i in range(0, self.len - 1)
		self[i] = callback(self[i], i, self)
	end for
	return self
end function

list.removeAll = function(str)
	copy = []
	if not checks.isA(@str, string) then
		return null
	end if

	for i in range(0, self.len - 1)
		if self[i] != str then
			copy.push(self[i])
		end if
	end for

	return copy
end function
list.fillUntil = function(len,with)
	while self.len < len
		self.push(with)
	end while
	return self
end function
string.color = function(c)
	
	if @c isa color then
		return "<color=#" + c.getHex + ">" + self + "</color>"
	end if
	colored = ""

	for i in range(0, self.len - 1)
		d = i / self.len
		colored = colored + "<color=#" + c(d).getHex + ">" + self[i] + "</color>"
	end for

	return colored
end function

string.capitalize = function(self)
	
	if self.len < 1 then
		return ""
	end if
	return self[0].upper + self[1 : ]
end function

number.isBetween = function(a, b)
	return self >= a and self <= b
end function
string.matchesplus= function(regex,rules="m")
	if not self then return false
	match = self.matches(regex,rules)
	return match.hasIndex(0) and match[0].len == self.len
end function

