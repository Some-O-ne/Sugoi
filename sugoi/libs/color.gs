import_code("builtinplus.gs")
color = {}
color.RGBfill = function(r,g,b)
	_ = function(el,idx,arr)
			return typeof(el) == "number" and el.isBetween(0,255)
		end function
	if [r,g,b].map(@_) != [true,true,true] then return false
	self.__color = {}
	self.__color.r = r
	self.__color.g = g
	self.__color.b = b

end function



color.getHex = function()

    hex = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"a",11:"b",12:"c",13:"d",14:"e",15:"f"}
    return hex[floor(self.__color.r/16)]+hex[floor(self.__color.r%16)]+hex[floor(self.__color.g/16)]+hex[floor(self.__color.g%16)]+hex[floor(self.__color.b/16)]+hex[floor(self.__color.b%16)] 
end function

color.getRGB = function()
	return self.__color
end function



color.HSVfill = function(h,s,v)
	  f= function(n,h,s,v) 
		k = (n+h/60)%6
		return v - v*s*math.max( math.min(math.min(k,4-k),1), 0)
	end function
  self.RGBfill(f(5,h,s,v)*255,f(3,h,s,v)*255,f(1,h,s,v)*255)  
end function

