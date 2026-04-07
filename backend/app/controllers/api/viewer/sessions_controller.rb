module Api
  module Viewer
    class SessionsController < Api::BaseController
      def show
        role = session[:viewer_role]
        if role.present?
          render json: { role: role }
        else
          head :unauthorized
        end
      end

      def create
        org = current_organization
        password = params[:password].to_s

        role = if org.authenticate_leader_password(password)
          "leader"
        elsif org.authenticate_member_password(password)
          "member"
        end

        if role
          session[:viewer_role] = role
          render json: { role: role }
        else
          render_errors([ "パスワードが正しくありません" ], status: :unauthorized)
        end
      end

      def destroy
        session.delete(:viewer_role)
        head :no_content
      end
    end
  end
end
