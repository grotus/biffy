module Api
	class BiometricsController < ApplicationController
		before_filter :authenticate_user!

		def index
			bio_data = current_user.collated_readings.try(:values).sort_by { |x| x[:entry_date] }.reverse!
			render json: bio_data.as_json
		end

		def create
			biometric = params[:biometric]
			entrydate = biometric[:entry_date]
			is_valid_date = DateTime.strptime(entrydate, "%Y-%m-%d") # should throw ArgumentException if the string cannot be parsed

			entry_bw = biometric[:weight]
			entry_bf_percent = biometric[:percent]
			entry_note = biometric[:note]

			# TODO: Move this stuff into a helper
			existing_bw = current_user.weight_readings.on(entrydate).first
			if existing_bw.nil?
				if entry_bw > 0
					new_weight_reading = current_user.weight_readings.build({weight: entry_bw, entry_date: entrydate})
					new_weight_reading.save
				end
			else
				if !entry_bw.nil? && entry_bw > 0
					existing_bw.weight = entry_bw
					existing_bw.save
				else
					existing_bw.destroy
				end
			end

			existing_bf_percent = current_user.fat_readings.on(entrydate).first
			if existing_bf_percent.nil?
				if entry_bf_percent > 0
					new_bf_reading = current_user.fat_readings.build({percent: entry_bf_percent, entry_date: entrydate})
					new_bf_reading.save
				end
			else
				if !entry_bf_percent.nil? && entry_bf_percent > 0
					existing_bf_percent.percent = entry_bf_percent
					existing_bf_percent.save
				else
					existing_bf_percent.destroy
				end
			end

			existing_note = current_user.notes.on(entrydate).first
			if existing_note.nil?
				if !entry_note.blank?
					new_note = current_user.notes.build({body: entry_note, entry_date: entrydate})
					new_note.save
				end
			else
				if !entry_note.blank?
					existing_note.body = entry_note
					existing_note.save
				else
					existing_note.destroy
				end
			end

			render json: {message: 'success'}

		rescue ArgumentError
			puts "INVALID ENTRY DATE POSTED: #{entrydate}"
			render json: {message: 'invalid_entry_date'} # return an error code too?
		end

		# Delete all entries for a particular date
		def destroy
			delete_date = params[:id]
			current_user.weight_readings.on(delete_date).first.try(:destroy)
			current_user.fat_readings.on(delete_date).first.try(:destroy)
			current_user.notes.on(delete_date).first.try(:destroy)
			render json: {message: 'success'}
		end
	end
end