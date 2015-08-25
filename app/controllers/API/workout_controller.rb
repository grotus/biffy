module Api
	class WorkoutController < ApplicationController
		before_filter :authenticate_user!

		def index
			excepted = [:user_id, :created_at, :updated_at]
			render json: current_user.workouts.as_json(
				except: excepted, 
				include: {
					workout_exercises: {
						except: excepted, 
						include: {
							exercise: {except: excepted},
							workout_sets: {except: excepted},
							tags: {}
						}
					}}
				)
		end

		def create
			#params.permit!
			workouts = params[:workout]
			puts "workout create params: #{workouts.to_json}"
			for workout in workouts
				#new_workout = Workout.new(workout)
				#new_workout = Workout.new(workout_params(workout))
				new_workout = build_workout(workout)
				# for ex in workout[:workout_exercises_attributes]
				# 	ex[:exercise_attributes][:user_id] = current_user.id
				# end
				# workout[:user_id] = current_user.id
				#puts "WORKOUT: #{workout}"
				#new_workout = Workout.new workout_params(workout)
				#puts "NEW_MODEL: #{new_workout.inspect}"
				result = new_workout.save
				#current_user.workouts.create(workout_params(workout))
				#result = current_user.save
				if !result
					puts "ERROR"
					puts "#{new_workout.errors.inspect}"
					puts "#{new_workout.errors.full_messages}"
				end
			end

			render json: {message: 'success'}
		end

		def destroy
			render json: {message: 'success'}
		end

		private

		def build_workout(data)
			workout = Workout.new(user: current_user, entry_date: data[:entry_date])
			for wo_exercise in data[:workout_exercises_attributes]
				workout.workout_exercises.push build_workout_exercise(wo_exercise, workout)
			end
			puts "BUILD_WORKOUT: #{workout.inspect}"
			workout
		end

		def build_workout_exercise(data, workout)
			exercise = get_exercise_object(data[:exercise_attributes][:name])
			wo_exercise = WorkoutExercise.new(exercise: exercise, tag_list: data[:tag_list], order: data[:order], workout: workout)
			for wo_set in data[:workout_sets_attributes]
				wo_exercise.workout_sets.push build_workout_set(wo_set, wo_exercise)
			end
			wo_exercise
		end

		def get_exercise_object(name)
			existing_exercise = current_user.exercises.find_by(name: name)
			puts "!!!!EXISTING_EXERCISE: #{existing_exercise.inspect}"
			if !existing_exercise.nil?
				return existing_exercise
			end
			Exercise.new(name: name, user: current_user)
		end

		def build_workout_set(data, wo_exercise)
			WorkoutSet.new(weight: data[:weight], reps: data[:reps], warmup: data[:isWarmup], order: data[:order], workout_exercise: wo_exercise)
		end

		def workout_params(data)
			permitted = data.permit(:user_id, :entry_date, {workout_exercises_attributes: {tag_list: [], exercise_attributes: [:name, :user_id], workout_sets_attributes: [:weight, :reps]}})
			puts "permitted: #{permitted}"
			permitted
		end
	end
end