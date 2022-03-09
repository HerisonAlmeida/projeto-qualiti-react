import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { render } from "react-dom";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

const endpoint = "/departments";

const columns = [
    {
        value: "ID",
        id: "id",
    },
    {
        value: "Name",
        name: "name",
    },
];

const INITIAL_STATE = { id: 0, name: "" };

const Departments = () => {
    const [visible, setVisible] = useState(false);
    const [department, setDepartment] = useState(INITIAL_STATE);


    const handleSave = async (refetch) => {
        try {
            if (department.id) {
                await api.put(`${endpoint}/${department.id}`, {
                    name: department.name,
                });

                toast.success("Atualizado com sucesso!");
            } else {
                await api.post(endpoint, { name: department.name });

                toast.success("Cadastrado com sucesso!");
            }

            setVisible(false);

            await refetch();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const actions = [
        {
            name: "Edit",
            action: (_department) => {
                setDepartment(_department);
                setVisible(true);
            },
        },
        {
            name: "Remove",
            action: async (item, refetch) => {
                if (window.confirm("Você tem certeza que deseja remover?")) {
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
        <Page title="Departamentos">
            <Button
                className="mb-2"
                onClick={() => {
                    setDepartment(INITIAL_STATE);
                    setVisible(true);
                }}
            >
                Criar Department
            </Button>
            <ListView actions={actions} columns={columns} endpoint={endpoint}>
                {({ refetch }) => (
                    <Modal
                        title={`${department.id ? "Update" : "Create"} Department`}
                        show={visible}
                        handleClose={() => setVisible(false)}
                        handleSave={() => handleSave(refetch)}
                    >
                        <Form>
                            <Form.Group>
                                <Form.Label>Department Name</Form.Label>
                                <Form.Control
                                    name="Department"
                                    onChange={(event) =>
                                        setDepartment({ ...department, name: event.target.value })
                                    }
                                    value={department.name}
                                />
                            </Form.Group>
                        </Form>
                    </Modal>
                )}
            </ListView>
        </Page>
    );
};

export default Departments;
