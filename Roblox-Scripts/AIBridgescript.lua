-- Roblox ServerScript (Letakkan di ServerScriptService)
local HttpService = game:GetService("HttpService")

-- Pastikan URL TIDAK diakhiri dengan garis miring (/) dan tidak ada spasi
local SERVER_URL = "https://robloxstudio-pg-production.up.railway.app/ai"

local function getAIResponse(prompt)
	local data = {
		prompt = prompt
	}
	
	local jsonData = HttpService:JSONEncode(data)
	
	print("Mengirim request ke: " .. SERVER_URL)
	
	local success, response = pcall(function()
		return HttpService:PostAsync(
			SERVER_URL, 
			jsonData, 
			Enum.HttpContentType.ApplicationJson,
			false -- cache
		)
	end)
	
	if success then
		local decoded = HttpService:JSONDecode(response)
		if decoded and decoded.success then
			return decoded.answer
		else
			warn("AI Error: " .. (decoded and decoded.error or "Unknown error"))
		end
	else
		-- Jika 404 muncul di sini, berarti path /ai tidak ditemukan di server
		warn("HTTP Request failed: " .. tostring(response))
	end
	
	return nil
end

game.Players.PlayerAdded:Connect(function(player)
	player.Chatted:Connect(function(message)
		-- Membersihkan spasi di awal/akhir pesan
		local cleanMessage = message:match("^%s*(.-)%s*$")
		
		-- Cek jika pesan dimulai dengan !ai (tidak peka huruf besar/kecil)
		if cleanMessage:sub(1, 4):lower() == "!ai " then
			local prompt = cleanMessage:sub(5)
			if #prompt > 0 then
				print("Player " .. player.Name .. " asking AI: " .. prompt)
				
				local answer = getAIResponse(prompt)
				if answer then
					print("Gemini: " .. answer)
				else
					print("Gagal mendapatkan jawaban dari AI.")
				end
			end
		end
	end)
end)