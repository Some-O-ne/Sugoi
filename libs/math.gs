math = {}
math.max = function(a,b)
	if a > b then return a
	return b
end function

math.min = function(a,b)
	if a < b then return a
	return b
end function
math.clamp = function(num,a,b)
	return self.min(self.max(a,num),b)
end function
math.isBetween = function(num,a,b)
	return num >= a and num <= b
end function
