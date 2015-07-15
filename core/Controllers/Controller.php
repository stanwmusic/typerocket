<?php
namespace TypeRocket\Controllers;

/**
 * Class Controller
 *
 * Be sure to validate by https://codex.wordpress.org/Roles_and_Capabilities
 * when building your own controllers.
 *
 * @package TypeRocket\Controllers
 */
abstract class Controller
{

    public $item_id = null;
    public $action = null;
    public $fields = null;
    public $valid = null;
    public $defaultValues = null;
    public $staticValues = null;
    public $response = array('message' => 'Message...', 'errors' => array());
    /** @var \WP_User */
    public $currentUser = null;
    public $requestType = null;

    function save( $item_id, $action = 'update' )
    {

        $this->fields  = isset( $_POST['tr'] ) ? $_POST['tr'] : array();
        $this->item_id = $item_id;
        $this->action  = $action;
        $this->currentUser = wp_get_current_user();

        if ($this->getValidate()) {
            $this->filter();

            if ($this->action === 'update') {
                $this->update();
            } elseif ($this->action === 'create') {
                $this->create();
            }

        }

        return $this;

    }

    function getValidate()
    {
        return $this->valid = true;
    }

    function getResponseArrayByItemId( $item_id, $method )
    {
        $method        = strtoupper( $method );
        $this->item_id = $item_id;

        switch ($method) {
            case 'PUT' :
                $this->response['message'] = 'Updated';
                $this->save( $item_id, 'update' );
                break;
            case 'POST' :
                $this->response['message'] = 'Created';
                $this->save( $item_id, 'create' );

                break;
            case 'GET' :
                $this->response['message'] = 'GET Requests Not Accepted';
                $this->read( $item_id );

                break;
            case 'DELETE' :
                $this->response['message'] = 'Deleted';
                $this->delete( $item_id );
                break;
        }

        $data = array( 'message' => $this->response['message'], 'valid' => $this->valid, 'redirect' => false, 'errors' => $this->response['errors'] );

        return $data;

    }

    function filter()
    {
        return $this;
    }

    protected function update()
    {
        return $this;
    }

    protected function create()
    {
        return $this;
    }

    protected function delete( $id )
    {
        return $this;
    }

    protected function read( $id )
    {
        return $this;
    }

}