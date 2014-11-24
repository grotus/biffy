module Api
	class BiometricsController < ApplicationController
		before_filter :authenticate_user!

		def index
			bw_data = current_user.weight_readings.select("id, weight, entry_date").order("entry_date DESC")
			render json: bw_data.as_json
		end

		def create
			biometric = params[:biometric]
			bodyweight = {weight: biometric[:weight], entry_date: biometric[:entry_date]}
			puts "CREATE RECEIVED! #{biometric}, #{bodyweight} !!"

			weight_reading = current_user.weight_readings.build(bodyweight)


			if weight_reading.save
				render json: {message: 'success'}
			else
				render json: {message: 'error'}
			end
		end
	end
end