import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { render } from "react-dom";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

const endpoint = "/professors";

const columns = [
    {
        value: "ID",
        id: "id",
    },
    {
        value: "Name",
        id: "name",
    },
    {
        value: "cpf",
        id: "cpf"
    },
    {
        value: "departmentId",
        id: "departmentId",
        render: (departament) => department.name,
    },
];

const INITIAL_STATE = { id: 0, name: "", cpf: "", departmentId: 0 };

const Professor = () => {
    const [visible, setVisible] = useState(false);
    const [department, setDepartments] = useState([]);
    const [professor, setProfessor] = useState(INITIAL_STATE);
    
    useEffect(() => {
        api
          .get("/departments")
          .then((response) => {
            setDepartments(response.data);
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }, []);

    const handleSave = async (refetch) => {
        try {
            if (professor.id) {
                await api.put(`${endpoint}/${professor.id}`, {
                    name: professor.name,
                    cpf: professor.cpf,
                    departmentId: professor.departmentId,
                });

                toast.success("Atualizado com Sucesso!");
            } else {
                await api.post(endpoint, { name: professor.name })

            }
            await refetch();
        } catch (error) {
            toast.error(error.message);
        }
    }


const actions = [
    {
        name: "Edit",
        action: (_professor) => {
            setProfessor(_professor_);
            setVisible(true);
        },
    },
    {
        name: "Remove",
        action: async (item, refetch) => {
            if (window.confirm("Você tem certeza que seja deseja remover?")) {
                try {
                    await api.delete(`${endpoint}/${item.id}`);
                    await refetch();
                    toast.info(`${item.name} foi removido`);
                } catch (error) {
                    toast.info(error.message);
                }
            }
        },
    },
];

return (
    <Page title="Professores">
        <Button
            className="mb-2"
            onClick={() => {
                setProfessor(INITIAL_STATE);
                setVisible(true);
            }}
        >
            Criar Professor
        </Button>
        <ListView actions={actions} columns={columns} endpoint={endpoint}>
            {({ refetch }) => (
                <Modal
                    title={`${professor.id ? "Update" : "Create"} Professor `}
                    show={visible}
                    handleClose={() => setVisible(false)}
                    handleSave={() => handleSave(refetch)}
                >
                    <Form>
                        <Form.Group>
                            <Form.Label>Professor Name
                                <Form.Control
                                    name="professor"
                                    onChange={(event) =>
                                        setProfessor({ ...professor, name: event.target.value })
                                    }
                                    value={professor.name}
                                />
                            </Form.Label>
                        </Form.Group>
                    </Form>
                </Modal>
            )}
        </ListView>
    </Page>
);
};


export default Professor;

