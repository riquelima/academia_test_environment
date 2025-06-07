import React, { useState, useRef } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from 'hookform-resolvers-zod'; 
import { studentFormSchema, StudentFormData } from '../schemas/studentSchema';
import { maskCPF, maskPhone } from '../utils/maskUtils';
import { IconCalendar, IconUserCircle, IconPlus } from '../constants.tsx';
import TagInput from './TagInput'; 
import { objectiveSuggestions } from '../data/mockData'; 

interface AlunoFormProps {
  onSubmit: SubmitHandler<StudentFormData>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const AlunoForm: React.FC<AlunoFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const { register, handleSubmit, control, formState: { errors }, setValue, watch, reset } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      cpf: '',
      phone: '',
      dateOfBirth: '',
      objectives: [], 
      avatar: '',
      observations: '',
    }
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert("Formato de imagem inválido. Use JPG, JPEG ou PNG.");
        if (event.target) event.target.value = ''; 
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setValue('avatar', base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCancelClick = () => {
    reset(); 
    setAvatarPreview(null); 
    onCancel(); 
  };
  
  const currentAvatar = watch('avatar');
  const inputBaseClasses = "w-full p-3 bg-gray-50 dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-lg text-dark-text dark:text-light-text focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center space-y-3">
        {avatarPreview || currentAvatar ? (
          <img src={avatarPreview || currentAvatar} alt="Avatar Preview" className="w-32 h-32 rounded-full object-cover border-2 border-brand-orange dark:border-orange-600" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-light-border dark:border-dark-border">
            <IconUserCircle className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handlePhotoChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button type="button" onClick={triggerFileInput} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-dark-text dark:text-light-text text-sm py-2 px-4 rounded-lg flex items-center space-x-2">
           <IconPlus className="w-4 h-4"/>
          <span>Selecionar Foto</span>
        </button>
        {errors.avatar && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.avatar.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">Email (para login)</label>
          <input id="email" type="email" {...register('email')} placeholder="Ex: aluno@email.com" className={inputBaseClasses} />
          {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">Senha (para login)</label>
          <input id="password" type="password" {...register('password')} placeholder="Mínimo 6 caracteres" className={inputBaseClasses} />
          {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">Nome Completo</label>
          <input id="fullName" type="text" {...register('fullName')} placeholder="Ex: João da Silva" className={inputBaseClasses} />
          {errors.fullName && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">CPF</label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <input 
                id="cpf" 
                type="text" 
                {...field} 
                onChange={e => field.onChange(maskCPF(e.target.value))} 
                placeholder="000.000.000-00" 
                className={inputBaseClasses} 
              />
            )}
          />
          {errors.cpf && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.cpf.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">Telefone</label>
           <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input 
                id="phone" 
                type="tel" 
                {...field} 
                onChange={e => field.onChange(maskPhone(e.target.value))} 
                placeholder="(00) 00000-0000" 
                className={inputBaseClasses}
              />
            )}
          />
          {errors.phone && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">Data de Nascimento</label>
          <div className="relative">
            <input id="dateOfBirth" type="date" {...register('dateOfBirth')} className={`${inputBaseClasses} pr-10`} />
            <IconCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-medium-text-light dark:text-medium-text pointer-events-none" />
          </div>
          {errors.dateOfBirth && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>}
        </div>
        
        <div className="md:col-span-2">
          <Controller
            name="objectives"
            control={control}
            render={({ field }) => (
              <TagInput
                id="objectives"
                label="Objetivos"
                value={field.value}
                onChange={field.onChange}
                suggestions={objectiveSuggestions}
                placeholder="Adicione objetivos (Ex: Hipertrofia)"
                error={errors.objectives?.message}
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="observations" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">Observações</label>
          <textarea id="observations" {...register('observations')} placeholder="Ex: Alergias, objetivos específicos, etc." rows={3} className={inputBaseClasses}></textarea>
          {errors.observations && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.observations.message}</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        <button type="button" onClick={handleCancelClick} disabled={isSubmitting} className="w-full sm:w-auto py-2.5 px-6 border border-light-border dark:border-dark-border rounded-lg text-medium-text-light dark:text-medium-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-brand-orange text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 flex items-center justify-center">
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Salvar Aluno'}
        </button>
      </div>
    </form>
  );
};

export default AlunoForm;