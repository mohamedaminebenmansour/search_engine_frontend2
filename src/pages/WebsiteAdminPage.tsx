import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, clearToken } from "../utils/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  company_id: number | null;
}

interface Company {
  id: number;
  name: string;
  admin_id: number | null;
  created_at: string;
}

interface Statistics {
  total_users: number;
  total_companies: number;
  total_documents: number;
}

interface CurrentUser {
  id: number;
  username: string;
  role: string;
  company_id: number | null;
}

export default function WebsiteAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyAdminId, setNewCompanyAdminId] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching current user details from localStorage...");
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found in localStorage");
          setError("Utilisateur non authentifié");
          navigate("/login");
          return;
        }

        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          console.warn("No user data found in localStorage");
          setError("Données utilisateur non trouvées");
          navigate("/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.user_id || !parsedUser.role) {
          console.warn("Invalid user data in localStorage:", parsedUser);
          setError("Données utilisateur invalides");
          navigate("/login");
          return;
        }

        setCurrentUser({
          id: parsedUser.user_id,
          username: parsedUser.username,
          role: parsedUser.role,
          company_id: parsedUser.company_id,
        });
        console.log("Current user set:", parsedUser);

        console.log("Fetching users...");
        const usersResponse = await apiFetch("/admin/users", { method: "GET" });
        console.log("Users response:", usersResponse);
        setUsers(usersResponse.users || []);

        console.log("Fetching companies...");
        const companiesResponse = await apiFetch("/company/companies", {
          method: "GET",
        });
        console.log("Companies response:", companiesResponse);
        setCompanies(companiesResponse.companies || []);

        console.log("Fetching statistics...");
        const statsResponse = await apiFetch("/admin/statistics", {
          method: "GET",
        });
        console.log("Statistics response:", statsResponse);
        setStatistics(statsResponse.statistics || {});
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err.message || "Erreur lors du chargement des données");
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const handleCreateCompany = async () => {
    try {
      console.log("Current user:", currentUser);
      console.log("Creating company with name:", newCompanyName, "admin_id:", newCompanyAdminId);
      const response = await apiFetch("/company/companies", {
        method: "POST",
        body: JSON.stringify({ name: newCompanyName, admin_id: newCompanyAdminId || null }),
      });
      console.log("Company created successfully:", response);
      console.log("Fetching updated companies list...");
      const companiesResponse = await apiFetch("/company/companies", {
        method: "GET",
      });
      console.log("Updated companies response:", companiesResponse);
      setCompanies(companiesResponse.companies || []);
      console.log("Companies set:", companiesResponse.companies || []);
      setNewCompanyName("");
      setNewCompanyAdminId("");
      setError("");
    } catch (err) {
      console.error("Error in handleCreateCompany:", err);
      setError(err.message || "Erreur lors de la création de l’entreprise");
    }
  };

  const handleUpdateUser = async (userId: number, newRole: string, newCompanyId: string | null) => {
    try {
      console.log("Current user:", currentUser);
      console.log("Updating user:", { userId, newRole, newCompanyId });
      const response = await apiFetch("/admin/users", {
        method: "PUT",
        body: JSON.stringify({ user_id: userId, role: newRole, company_id: newCompanyId || null }),
      });
      console.log("User updated successfully:", response);
      console.log("Fetching updated users list...");
      const usersResponse = await apiFetch("/admin/users", { method: "GET" });
      console.log("Updated users response:", usersResponse);
      setUsers(usersResponse.users || []);
      console.log("Users set:", usersResponse.users || []);
      setError("");
    } catch (err) {
      console.error("Error in handleUpdateUser:", {
        message: err.message,
        userId,
        newRole,
        newCompanyId,
      });
      setError(err.message || "Erreur lors de la mise à jour de l’utilisateur");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        console.log("Current user:", currentUser);
        console.log("Deleting user with ID:", userId);
        const response = await apiFetch("/admin/users", {
          method: "DELETE",
          body: JSON.stringify({ user_id: userId }),
        });
        console.log("User deleted successfully:", response);
        setUsers(users.filter((user) => user.id !== userId));
        console.log("Updated users list (local):", users.filter((user) => user.id !== userId));
        setError("");
      } catch (err) {
        console.error("Error in handleDeleteUser:", {
          message: err.message,
          userId,
        });
        setError(err.message || "Erreur lors de la suppression de l’utilisateur");
      }
    }
  };

  const handleUpdateCompany = async (companyId: number, name: string) => {
    try {
      console.log("Current user:", currentUser);
      console.log("Updating company:", { companyId, name });
      const response = await apiFetch(`/company/${companyId}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      console.log("Company updated successfully:", response);
      console.log("Fetching updated companies list...");
      const companiesResponse = await apiFetch("/company/companies", {
        method: "GET",
      });
      console.log("Updated companies response:", companiesResponse);
      setCompanies(companiesResponse.companies || []);
      console.log("Companies set:", companiesResponse.companies || []);
      setError("");
    } catch (err) {
      console.error("Error in handleUpdateCompany:", {
        message: err.message,
        companyId,
        name,
      });
      setError(err.message || "Erreur lors de la mise à jour de l’entreprise");
    }
  };

  const handleDeleteCompany = async (companyId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")) {
      try {
        console.log("Current user:", currentUser);
        console.log("Deleting company with ID:", companyId);
        const response = await apiFetch(`/company/${companyId}`, {
          method: "DELETE",
        });
        console.log("Company deleted successfully:", response);
        setCompanies(companies.filter((company) => company.id !== companyId));
        console.log("Updated companies list (local):", companies.filter((company) => company.id !== companyId));
        setError("");
      } catch (err) {
        console.error("Error in handleDeleteCompany:", {
          message: err.message,
          companyId,
        });
        setError(err.message || "Erreur lors de la suppression de l’entreprise");
      }
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0FFFF] to-[#ADD8E6] text-gray-800 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-center text-[#2F4F4F]">
            Website Admin Dashboard
          </h2>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-500 text-white rounded-xl font-bold"
          >
            Logout
          </button>
        </div>

        {currentUser && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">Current User</h3>
            <p>ID: {currentUser.id}</p>
            <p>Username: {currentUser.username}</p>
            <p>Role: {currentUser.role}</p>
            <p>Company ID: {currentUser.company_id || "None"}</p>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {statistics && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">Platform Statistics</h3>
            <p>Total Users: {statistics.total_users}</p>
            <p>Total Companies: {statistics.total_companies}</p>
            <p>Total Documents: {statistics.total_documents}</p>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">Create Company</h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Company name"
              className="w-full p-4 border border-gray-300 rounded-xl"
            />
            <input
              type="number"
              value={newCompanyAdminId}
              onChange={(e) => setNewCompanyAdminId(e.target.value)}
              placeholder="Admin ID (optional)"
              className="w-full p-4 border border-gray-300 rounded-xl"
            />
            <button
              onClick={handleCreateCompany}
              className="py-2 px-4 bg-[#4682B4] text-white rounded-xl font-bold"
            >
              Create
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">Manage Users</h3>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="p-2 border rounded-xl flex justify-between">
                <span>
                  {user.username} ({user.email}) - Role: {user.role}, Company ID:{" "}
                  {user.company_id || "None"}
                </span>
                <div>
                  <select
                    onChange={(e) => handleUpdateUser(user.id, e.target.value, user.company_id)}
                    value={user.role}
                    className="mr-2 p-2 border rounded-xl"
                  >
                    <option value="user">User</option>
                    <option value="company_admin">Company Admin</option>
                    <option value="website_admin">Website Admin</option>
                  </select>
                  <select
                    onChange={(e) => handleUpdateUser(user.id, user.role, e.target.value || null)}
                    value={user.company_id || ""}
                    className="mr-2 p-2 border rounded-xl"
                  >
                    <option value="">None</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="py-1 px-2 bg-red-500 text-white rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">Manage Companies</h3>
          <ul className="space-y-2">
            {companies.map((company) => (
              <li key={company.id} className="p-2 border rounded-xl flex justify-between">
                <span>
                  {company.name} (Admin ID: {company.admin_id || "None"})
                </span>
                <div>
                  <input
                    type="text"
                    defaultValue={company.name}
                    onBlur={(e) => handleUpdateCompany(company.id, e.target.value)}
                    className="mr-2 p-2 border rounded-xl"
                  />
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="py-1 px-2 bg-red-500 text-white rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}