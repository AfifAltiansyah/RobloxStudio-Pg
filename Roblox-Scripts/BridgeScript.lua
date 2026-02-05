local HttpService = game:GetService("HttpService")

-- URL Railway
local URL = "https://robloxstudio-pg-production.up.railway.app/ai"

local function sendDataToAI(message)
	local data = {
		["prompt"] = message, -- Menggunakan 'prompt' agar sesuai dengan index.js
		["userId"] = 12345,
		["timestamp"] = os.date("!*t")
	}
	
	local jsonPayload = HttpService:JSONEncode(data)
	
	print("Mengirim data ke Railway: " .. URL)
	
	local success, response = pcall(function()
		return HttpService:PostAsync(URL, jsonPayload, Enum.HttpContentType.ApplicationJson)
	end)
	
	if success then
		local responseData = HttpService:JSONDecode(response)
		if responseData.success then
			print("Respon dari AI: " .. tostring(responseData.answer))
		else
			warn("Server merespon dengan error: " .. tostring(responseData.error))
		end
	else
		warn("Gagal terhubung ke Railway: " .. tostring(response))
	end
end

-- Contoh pemanggilan
sendDataToAI("Halo dari Roblox Studio!")