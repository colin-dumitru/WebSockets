class SessionsController < ApplicationController
  include Tubesock::Hijack

  @@sessions = Hash.new

  def home
    id = params[:id]
    session[:id] = Random.rand(10000000)

    if @@sessions[id]
      @@sessions[id].user2 = session[:id]
    else
      @@sessions[id] = Session.new
      @@sessions[id].user1 = session[:id]
    end

    @session_id = id

    render 'home/home'
  end

  def stream
    session_id = session[:id]

    hijack do |tubesock|
      tubesock.onopen do
        tubesock.send_data 'Connection established'
      end

      tubesock.onmessage do |data|
        data = data.to_s

        logger.debug "Data Received: #{data.length}"
        tubesock.send_data @@sessions[params[:id]].set_data(session_id, data)
      end
    end
  end
end

class Session

  attr_accessor :user2, :user1
  attr_reader :user2_data, :user1_data

  @user1 = nil
  @user2 = nil

  @user1_data = nil
  @user2_data = nil

  def set_data(session_id, data)
    if session_id == @user1
      @user1_data = data
      @user2_data
    else
      @user2_data = data
      @user1_data
    end
  end

end
