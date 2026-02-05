-- Roblox ServerScript (Letakkan di ServerScriptService)
local HttpService = game:GetService("HttpService")

-- Ganti URL ini dengan URL Railway kamu nanti
local SERVER_URL = "https://your-app-name.railway.app/ai"

local function getAIResponse(prompt)
	local data = {
		prompt = prompt
	}
	
	local jsonData = HttpService:JSONEncode(data)
	
	local success, response = pcall(function()
		return HttpService:PostAsync(SERVER_URL, jsonData, Enum.HttpContentType.ApplicationJson)
	end)
	
	if success then
		local decoded = HttpService:JSONDecode(response)
		if decoded.success then
			return decoded.answer
		else
			warn("AI Error: " .. (decoded.error or "Unknown error"))
		end
	else
		warn("HTTP Request failed: " .. tostring(response))
	end
	
	return nil
end

-- Contoh penggunaan saat player chat
game.Players.PlayerAdded:Connect(function(player)
	player.Chatted:Connect(function(message)
		if message:sub(1, 4) == "!ai " then
			local prompt = message:sub(5)
			print("Player " .. player.Name .. " asking AI: " .. prompt)
			
			local answer = getAIResponse(prompt)
			if answer then
				-- Tampilkan jawaban di chat (atau lakukan aksi lain)
				print("AI Answer: " .. answer)
				-- Contoh aksi: Munculkan pesan di chat
				-- (Gunakan RemoteEvent untuk kirim ke Client jika ingin UI khusus)
			end
		end
	end)
end)
