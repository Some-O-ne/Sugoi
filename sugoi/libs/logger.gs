logger = {}
logger.log = function(string,severityLevel)
    _ = [[theme.success,"Info:"],[theme.warning,"Warning: "],[theme.error,"Error:"]]
    print((_[severityLevel][1]+string).color(_[severityLevel][0]))
end function
