module Api
  module Admin
    class SessionsController < Api::BaseController
      def create
        org = current_organization
        if org.authenticate_admin_password(params[:password].to_s)
          session[:admin_authenticated] = true
          head :ok
        else
          render_errors([ "パスワードが正しくありません" ], status: :unauthorized)
        end
      end

      def destroy
        session.delete(:admin_authenticated)
        head :no_content
      end
    end
  end
end
